"use client";
import React, { useRef, useState, useEffect } from "react";
import { PiListBullets } from "react-icons/pi";
import { MdFormatListNumbered } from "react-icons/md";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  children,
  title,
  isActive,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  isActive?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "hover:bg-blue-500"
    }`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your blog description here..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false,
    unorderedList: false,
    orderedList: false,
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const checkActiveStates = () => {
    if (!editorRef.current) return;

    const isBold = document.queryCommandState("bold");
    const isItalic = document.queryCommandState("italic");
    const isUnderline = document.queryCommandState("underline");
    const isInUnorderedList = document.queryCommandState("insertUnorderedList");
    const isInOrderedList = document.queryCommandState("insertOrderedList");

    const selection = window.getSelection();
    let isInCode = false;
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === "PRE") {
            isInCode = true;
            break;
          }
        }
        node = node.parentNode;
      }
    }

    setActiveStates({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      unorderedList: isInUnorderedList,
      orderedList: isInOrderedList,
      code: isInCode,
    });
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setTimeout(checkActiveStates, 0);
  };

  useEffect(() => {
    const handleSelectionChange = () => checkActiveStates();
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
    setTimeout(checkActiveStates, 0);
  };

  const insertList = (isOrdered: boolean) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(
      isOrdered ? "insertOrderedList" : "insertUnorderedList",
      false
    );
    handleInput();
    setTimeout(checkActiveStates, 0);
  };

  const insertCodeBlock = () => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.commonAncestorContainer;

    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === "PRE") {
          const parent = element.parentNode;
          if (parent) {
            const textNode = document.createTextNode(element.textContent || "");
            parent.replaceChild(textNode, element);
            handleInput();
            setTimeout(checkActiveStates, 0);
            return;
          }
        }
      }
      node = node.parentNode;
    }

    const codeElement = document.createElement("pre");
    codeElement.style.border = "1px solid #f4741f";
    codeElement.style.padding = "12px";
    codeElement.style.borderRadius = "4px";
    codeElement.style.fontFamily = "monospace";
    codeElement.style.overflowX = "auto";
    codeElement.style.minHeight = "10px";
    codeElement.style.display = "block";

    if (range.collapsed) {
      codeElement.innerHTML = "<br />";
    } else {
      codeElement.appendChild(range.extractContents());
    }

    range.insertNode(codeElement);
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(codeElement);
    newRange.collapse(true);
    selection.addRange(newRange);

    handleInput();
    setTimeout(checkActiveStates, 0);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <style>{`
        .rich-editor-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rich-editor-content ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 8px 0;
        }
        .rich-editor-content ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 8px 0;
        }
        .rich-editor-content li {
          margin: 4px 0;
        }
        .rich-editor-content pre {
          padding: 12px;
          border-radius: 4px;
          font-family: monospace;
          overflow-x: auto;
          margin: 8px 0;
        }
        .rich-editor-content code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 2px;
          font-family: monospace;
        }
      `}</style>

      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 flex gap-1 flex-wrap">
        <ToolbarButton
          onClick={() => execCommand("bold")}
          title="Bold"
          isActive={activeStates.bold}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("italic")}
          title="Italic"
          isActive={activeStates.italic}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("underline")}
          title="Underline"
          isActive={activeStates.underline}
        >
          <u>U</u>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={insertCodeBlock}
          title="Code Block"
          isActive={activeStates.code}
        >
          <code className="px-1 rounded text-sm">&lt;/&gt;</code>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => insertList(false)}
          title="Bullet List"
          isActive={activeStates.unorderedList}
        >
          <PiListBullets style={{ width: "30px", height: "30px" }} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList(true)}
          title="Numbered List"
          isActive={activeStates.orderedList}
        >
          <MdFormatListNumbered style={{ width: "30px", height: "30px" }} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        onInput={handleInput}
        onMouseUp={checkActiveStates}
        onKeyUp={checkActiveStates}
        onFocus={() => {
          setIsFocused(true);
          checkActiveStates();
        }}
        onBlur={() => setIsFocused(false)}
        className={`rich-editor-content min-h-[300px] p-4 focus:outline-none ${
          isFocused
            ? "ring-2 ring-blue-500"
            : "focus:ring-2 focus:ring-blue-500"
        }`}
        style={{
          backgroundColor: "transparent",
          direction: "ltr",
          textAlign: "left",
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
