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

const ITEM_HEIGHT = 30; // This must match the height defined in CSS
const VIEWPORT_HEIGHT = 200; // This should match max-height of .dropdownList in CSS

const CustomDropdown: React.FC<CustomDropdownProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0); // Initialize visibleStartIndex
  const { items, loading } = useNames();

  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = visibleStartIndex * ITEM_HEIGHT; // Ensure the scroll position is updated when dropdown opens

    }
  }, [isOpen, visibleStartIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const scrollTop = listRef.current.scrollTop;
        const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
        setVisibleStartIndex(startIndex); // Set the index based on current scroll position
      }
    };

    const listElem = listRef.current;
    if (listElem && isOpen) {
      listElem.addEventListener('scroll', handleScroll);
      return () => listElem.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, items.length]);  // Also depend on isOpen to attach/remove listener

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return loading ? <div>Loading data...</div> : (
    <div ref={dropdownRef} className="dropdownContainer">
      <div onClick={() => setIsOpen(!isOpen)} className="dropdownButton">
        {selectedItem || "Select an option"}
      </div>
      {isOpen && (
        <ul ref={listRef} className="dropdownList" style={{ maxHeight: VIEWPORT_HEIGHT, overflowY: 'auto' }}>
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleItems.map((item, index) => (
              <li
                key={item.objectId}
                style={{ top: (visibleStartIndex + index) * ITEM_HEIGHT, position: 'absolute', width: '100%' }}
                className={classNames("dropdownItem", {
                  dropdownItemSelected: selectedItem === item.Name
                })}
                onMouseEnter={(e) => e.currentTarget.classList.add("dropdownItemHover")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("dropdownItemHover")}
                onClick={() => handleItemClick(item)}
              >
                {item.Name}
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
