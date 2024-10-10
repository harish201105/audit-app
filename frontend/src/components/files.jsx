import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar'; // Adjust import path if necessary

function Files() {
  const location = useLocation();
  const fileName = location.state?.fileName || 'No file selected'; // Extract file name from state
  const elements = location.state?.elements || []; // Extract elements from state (paragraphs, tables)

  const [editableElements, setEditableElements] = useState(elements); // Make elements editable
  const departments = ['Accounts', 'HR', 'Engineering', 'Audit', 'Finance']; // Example departments

  // Handle editing a paragraph
  const handleParagraphChange = (index, newValue) => {
    const updatedElements = [...editableElements];
    updatedElements[index].content = newValue;
    setEditableElements(updatedElements);
  };

  // Handle editing a table cell
  const handleTableCellChange = (elementIndex, rowIndex, cellIndex, newValue) => {
    const updatedElements = [...editableElements];
    let tableContent;

    try {
      tableContent = JSON.parse(updatedElements[elementIndex].content);
      if (!tableContent || !tableContent.data) {
        console.error("Invalid table content", tableContent);
        return;
      }
    } catch (error) {
      console.error("Error parsing table content", error);
      return;
    }

    // Update the specific cell
    tableContent.data[rowIndex][cellIndex] = newValue;
    updatedElements[elementIndex].content = JSON.stringify(tableContent); // Save the updated table
    setEditableElements(updatedElements);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">File: {fileName}</h1>
        <h3 className="text-center text-xl">Document Content</h3>

        <table border="1" className="w-full mt-5">
          <thead>
            <tr>
              <th>Sl.no</th>
              <th>Para Audit_Id</th>
              <th>Para Id</th>
              <th>Para Description</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {editableElements.map((element, index) => (
              <tr key={element._id || index}>
                <td>{index + 1}</td> {/* Serial Number */}
                <td>{element.paraAuditId || `N/A`}</td> {/* Para Audit_Id */}
                <td>{element.paraId || `N/A`}</td> {/* Para Id */}
                <td>
                  {element.type === 'paragraph' ? (
                    <textarea
                      value={element.content || ''}
                      onChange={(e) => handleParagraphChange(index, e.target.value)} // Handle paragraph edit
                      style={{ width: '100%', height: '100px' }}
                    />
                  ) : (
                    <table border="1" style={{ width: '100%' }}>
                      <tbody>
                        {(() => {
                          let tableContent;

                          try {
                            tableContent = JSON.parse(element.content);
                            if (!tableContent || !tableContent.data) {
                              throw new Error("Invalid table content");
                            }
                          } catch (error) {
                            console.error("Error parsing table content", error);
                            return <tr><td>Error loading table</td></tr>;
                          }

                          return tableContent.data.map((row, rowIndex) => (
                            <tr key={`${element._id}-row-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <td key={`${element._id}-row-${rowIndex}-cell-${cellIndex}`}>
                                  <textarea
                                    value={cell || ''}
                                    onChange={(e) =>
                                      handleTableCellChange(index, rowIndex, cellIndex, e.target.value)
                                    } // Handle table cell edit
                                    style={{ width: '100%', height: '50px' }}
                                  />
                                </td>
                              ))}
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  )}
                </td>
                <td>
                  {/* Display a select input for Department */}
                  <select>
                    {departments.map((dept, deptIndex) => (
                      <option key={deptIndex} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Files;
