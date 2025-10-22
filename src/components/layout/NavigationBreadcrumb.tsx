import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, FileText, BookOpen, Settings } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const breadcrumbConfig: Record<string, BreadcrumbConfig> = {
  '/app': {
    path: '/app',
    label: 'Dashboard',
    icon: Home,
  },
  '/app/upload': {
    path: '/app/upload',
    label: 'Upload',
    icon: Upload,
  },
  '/app/notes': {
    path: '/app/notes',
    label: 'Notes',
    icon: FileText,
  },
  '/app/quizzes': {
    path: '/app/quizzes',
    label: 'Quizzes',
    icon: BookOpen,
  },
  '/app/settings': {
    path: '/app/settings',
    label: 'Settings',
    icon: Settings,
  },
};

export const NavigationBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items based on current path
  const breadcrumbItems: BreadcrumbConfig[] = [];
  let currentPath = '';
  
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const config = breadcrumbConfig[currentPath];
    if (config) {
      breadcrumbItems.push(config);
    }
  }

  // Don't show breadcrumb if we're only on the dashboard
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const Icon = item.icon;

            return (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 hidden sm:block" />}
                      <span className="truncate">{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.path}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        {Icon && <Icon className="h-4 w-4 hidden sm:block" />}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};