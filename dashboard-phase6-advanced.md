# 📊 المرحلة السادسة - المكونات المتقدمة والرسوم البيانية

## 📋 نظرة عامة على المرحلة

هذه المرحلة تركز على:
- تطوير المكونات المتقدمة للرسوم البيانية
- إضافة مكونات UI متطورة
- تطوير نظام الإشعارات
- إضافة مكونات التفاعل المتقدمة
- تحسين تجربة المستخدم

---

## 🎯 الميزات الرئيسية

### **1. الرسوم البيانية المتقدمة**
- رسوم بيانية تفاعلية
- رسوم بيانية مخصصة
- تحليلات متقدمة
- تصدير الرسوم البيانية

### **2. مكونات UI متطورة**
- مكونات تفاعلية
- مكونات متحركة
- مكونات مخصصة
- مكونات متجاوبة

### **3. نظام الإشعارات**
- إشعارات فورية
- إشعارات مجدولة
- إشعارات مخصصة
- إدارة الإشعارات

### **4. التفاعل المتقدم**
- Drag & Drop
- Keyboard Shortcuts
- Context Menus
- Advanced Forms

### **5. تحسين الأداء**
- Lazy Loading
- Virtual Scrolling
- Memoization
- Code Splitting

---

## 📊 الرسوم البيانية المتقدمة

### **1. Line Chart Component**

```typescript
// src/components/charts/LineChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300,
  showLegend = true,
  showTooltip = true,
  animation = true,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animation ? {
      duration: 1000,
      easing: 'easeInOutQuart',
    } : false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        enabled: showTooltip,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'التاريخ',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'القيمة',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  );
};
```

### **2. Bar Chart Component**

```typescript
// src/components/charts/BarChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor: string | string[];
      borderWidth?: number;
      borderRadius?: number;
    }[];
  };
  title?: string;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300,
  horizontal = false,
  stacked = false,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: horizontal ? 'القيمة' : 'التاريخ',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        stacked: stacked,
      },
      y: {
        display: true,
        title: {
          display: true,
          text: horizontal ? 'التاريخ' : 'القيمة',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
        stacked: stacked,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
};
```

### **3. Pie Chart Component**

```typescript
// src/components/charts/PieChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300,
  showLegend = true,
  showTooltip = true,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        enabled: showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={data} options={options} />
    </div>
  );
};
```

### **4. Area Chart Component**

```typescript
// src/components/charts/AreaChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AreaChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
  title?: string;
  height?: number;
  gradient?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  title = 'الرسم البياني',
  height = 300,
  gradient = false,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'التاريخ',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'القيمة',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={options} />
    </div>
  );
};
```

---

## 🔔 نظام الإشعارات

### **1. Notification Provider**

```typescript
// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: NotificationState = {
  notifications: [],
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id },
    });

    if (notification.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
```

### **2. Notification Component**

```typescript
// src/components/notifications/Notification.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface NotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    actions?: Array<{
      label: string;
      action: () => void;
    }>;
  };
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4',
        getColorClasses(notification.type)
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{getIcon(notification.type)}</span>
        </div>
        <div className="ml-3 w-0 flex-1">
          <h3 className="text-sm font-medium">{notification.title}</h3>
          <p className="mt-1 text-sm">{notification.message}</p>
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={action.action}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
```

### **3. Notification Container**

```typescript
// src/components/notifications/NotificationContainer.tsx
import React from 'react';
import { Notification } from './Notification';
import { useNotifications } from '@/contexts/NotificationContext';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};
```

---

## 🎨 مكونات UI متطورة

### **1. Data Table Component**

```typescript
// src/components/tables/DataTable.tsx
import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface DataTableProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  searchable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchValue) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    if (filterValue) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    return filtered;
  }, [data, searchValue, filterValue]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize: currentPageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      {(searchable || filterable) && (
        <div className="flex space-x-4">
          {searchable && (
            <Input
              placeholder="البحث..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-xs"
            />
          )}
          {filterable && (
            <Input
              placeholder="فلترة..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="max-w-xs"
            />
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              عرض {pageIndex * currentPageSize + 1} إلى {Math.min((pageIndex + 1) * currentPageSize, filteredData.length)} من {filteredData.length} عنصر
            </span>
            <Select
              value={currentPageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              size="sm"
              variant="outline"
            >
              الأولى
            </Button>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              size="sm"
              variant="outline"
            >
              السابقة
            </Button>
            <span className="text-sm text-gray-700">
              صفحة {pageIndex + 1} من {pageOptions.length}
            </span>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              size="sm"
              variant="outline"
            >
              التالية
            </Button>
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              size="sm"
              variant="outline"
            >
              الأخيرة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### **2. Drag and Drop Component**

```typescript
// src/components/drag-drop/DragDropList.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/Card';

interface DragDropListProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
  }>;
  onReorder: (items: Array<{ id: string; content: React.ReactNode }>) => void;
  droppableId: string;
  className?: string;
}

export const DragDropList: React.FC<DragDropListProps> = ({
  items,
  onReorder,
  droppableId,
  className,
}) => {
  const [localItems, setLocalItems] = useState(items);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(localItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setLocalItems(newItems);
    onReorder(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 ${className} ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {localItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-400 cursor-move">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          {item.content}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
```

### **3. Context Menu Component**

```typescript
// src/components/context-menu/ContextMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  children: React.ReactNode;
  menuItems: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    divider?: boolean;
  }>;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menuItems,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      setPosition({ x: event.clientX, y: event.clientY });
      setIsOpen(true);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (container) {
        container.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className={className}>
        {children}
      </div>
      
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="border-t border-gray-200 my-1" />}
              <button
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !item.disabled && handleMenuItemClick(item.onClick)}
                disabled={item.disabled}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};
```

---

## ⚡ تحسين الأداء

### **1. Lazy Loading Component**

```typescript
// src/components/lazy/LazyComponent.tsx
import React, { Suspense, lazy } from 'react';
import { Loading } from '@/components/ui/Loading';

interface LazyComponentProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback = <Loading />,
  ...props
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
```

### **2. Virtual Scrolling Component**

```typescript
// src/components/virtual-scroll/VirtualScroll.tsx
import React, { useState, useEffect, useRef } from 'react';

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleStart + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🧪 الاختبارات

### **1. Chart Component Test**

```typescript
// src/components/charts/__tests__/LineChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LineChart } from '../LineChart';

describe('LineChart Component', () => {
  it('renders chart with correct data', () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Test Data',
          data: [1, 2, 3],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      ],
    };

    render(<LineChart data={data} />);
    
    // Chart.js renders a canvas element
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});
```

---

## 📝 ملاحظات المرحلة السادسة

1. **الأداء**: استخدام تقنيات تحسين الأداء المتقدمة
2. **التفاعل**: مكونات تفاعلية ومتجاوبة
3. **الرسوم البيانية**: رسوم بيانية متطورة وتفاعلية
4. **الإشعارات**: نظام إشعارات شامل
5. **تجربة المستخدم**: تحسين تجربة المستخدم بشكل كبير

---

*تم إعداد هذه المرحلة لتوفير مكونات متطورة وتجربة مستخدم متميزة*
