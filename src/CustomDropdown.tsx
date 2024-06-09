// src/CustomDropdown.tsx
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

const CustomDropdown: React.FC<CustomDropdownProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items, loading } = useNames();

  console.log('items', items, 'loading', loading);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: NameItem) => {
    setSelectedItem(item.Name);
    onChange(item.Name);
    setIsOpen(false);
  };

  const renderedItems = items.map((item) => (
    <li
      key={item.objectId}
      className={classNames("dropdownItem", {
        dropdownItemSelected: selectedItem === item.Name,
      })}
      onMouseEnter={(e) => e.currentTarget.classList.add("dropdownItemHover")}
      onMouseLeave={(e) =>
        e.currentTarget.classList.remove("dropdownItemHover")
      }
      onClick={() => handleItemClick(item)}
    >
      {item.Name}
    </li>
  ));

  const renderResult = loading ? <div>Loading data...</div> : (
    <div ref={dropdownRef} className="dropdownContainer">
      <div onClick={() => setIsOpen(!isOpen)} className="dropdownButton">
        {selectedItem || "Select an option"}
      </div>
      {isOpen && <ul className="dropdownList">{renderedItems}</ul>}
    </div>
  )

  return renderResult;
};

export default CustomDropdown;
