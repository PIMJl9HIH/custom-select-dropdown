import React, { useState, useEffect, useRef } from "react";
import { useNames } from "./hooks/useNames";

import classNames from "classnames";
import "./App.css";

interface NameItem {
  objectId: string;
  Name: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomDropdownProps {
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 30;
const VIEWPORT_HEIGHT = 200;

const CustomDropdown: React.FC<CustomDropdownProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0); // Initialize visibleStartIndex
  const { items, loading } = useNames();

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = visibleStartIndex * ITEM_HEIGHT; 
    }
  }, [isOpen, visibleStartIndex]);

  useEffect(() => {
    const listElem = listRef.current;
    if (listElem && isOpen) {
      listElem.addEventListener('scroll', handleScroll);
      return () => listElem.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseEvent);
    document.addEventListener("keydown", handleCloseEvent);
    return () => {
      document.removeEventListener("mousedown", handleCloseEvent);
      document.removeEventListener("keydown", handleCloseEvent);
    };
  }, []);

  const handleScroll = () => {
    if (listRef.current) {
      const scrollTop = listRef.current.scrollTop;
      const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
      setVisibleStartIndex(startIndex);
    }
  };

  const handleCloseEvent = (event: MouseEvent | KeyboardEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    } else if (event.type === "keydown" && (event as KeyboardEvent).key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleItemClick = (item: NameItem) => {
    const selectedIndex = items.findIndex(i => i.objectId === item.objectId);

    if (selectedIndex >= 0) {
      setVisibleStartIndex(selectedIndex);
    }

    setSelectedItem(item.Name);
    onChange(item.Name);
    setIsOpen(false);
  };

  const totalHeight = items.length * ITEM_HEIGHT;
  const visibleItemCount = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT);
  const visibleItems = items.slice(visibleStartIndex, visibleStartIndex + visibleItemCount);

  const renderItems = visibleItems.map((item, index) => (
    <li
      key={item.objectId}
      style={{ top: (visibleStartIndex + index) * ITEM_HEIGHT, position: 'absolute', width: '100%' }}
      className={classNames("dropdownItem", {
        dropdownItemSelected: selectedItem === item.Name
      })}
      onMouseEnter={(e) => e.currentTarget.classList.add("dropdownItemHover")}
      onMouseLeave={(e) => e.currentTarget.classList.remove("dropdownItemHover")}
      onClick={() => handleItemClick(item)}
      role="option"
      aria-selected={selectedItem === item.Name}
    >
      {item.Name}
    </li>
  ))

  return loading ? <div>Loading data...</div> : (
    <div ref={dropdownRef} className="dropdownContainer">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="dropdownButton" aria-haspopup="listbox" aria-expanded={isOpen}>
        {selectedItem || "Select an option"}
      </button>
      {isOpen && (
        <ul ref={listRef} className="dropdownList" style={{ maxHeight: VIEWPORT_HEIGHT, overflowY: 'auto' }} role="listbox">
          <div style={{ height: totalHeight, position: 'relative' }}>
            {renderItems}
          </div>
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;