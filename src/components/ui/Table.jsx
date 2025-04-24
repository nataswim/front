// Tableaux de données réutilisables pour les composants de tableaux de données
// Les composants de tableaux de données sont des composants réutilisables qui affichent des données tabulaires.
// Ils sont souvent utilisés pour afficher des données tabulaires dans des tableaux, des listes ou des grilles.
// Les composants de tableaux de données peuvent être configurés pour afficher des données tabulaires de différentes manières,
// exemple {/* Table simple */} 
// <Table    columns={[     { key: 'name', title: 'Nom' },     { key: 'email', title: 'Email' }   ]}   data={users} />

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Versatile Table component for the application
 * @param {Object} props - Component properties
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Table data
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.striped=false] - Enable striped rows
 * @param {boolean} [props.hover=false] - Enable hover effect
 * @param {function} [props.onRowClick] - Row click handler
 * @param {string} [props.emptyMessage='No data available'] - Message when no data
 */
const Table = ({
  columns,
  data,
  className = '',
  striped = false,
  hover = false,
  onRowClick,
  emptyMessage = 'No data available'
}) => {
  // Memoize columns and data processing
  const processedColumns = useMemo(() => columns.map(col => ({
    key: col.key,
    title: col.title,
    render: col.render || (value => value)
  })), [columns]);

  // Render table body rows
  const renderRows = () => {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td 
            colSpan={processedColumns.length} 
            className="text-center py-4 text-gray-500"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr
        key={row.id || rowIndex}
        className={`
          ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : ''}
          ${hover ? 'hover:bg-gray-100 cursor-pointer' : ''}
          ${onRowClick ? 'cursor-pointer' : ''}
        `}
        onClick={() => onRowClick && onRowClick(row)}
      >
        {processedColumns.map(col => (
          <td 
            key={col.key} 
            className="px-4 py-3 text-sm"
          >
            {col.render(row[col.key], row)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr>
            {processedColumns.map(col => (
              <th 
                key={col.key} 
                className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
};

// PropTypes for type checking
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    render: PropTypes.func
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string
};

export default Table;