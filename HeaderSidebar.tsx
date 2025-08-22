'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface HeaderSidebarProps {
  navigation: NavigationItem[];
  githubUrl?: string;
  className?: string;
}

const HeaderSidebar: React.FC<HeaderSidebarProps> = ({
  navigation,
  githubUrl = 'https://github.com/alijawdat-cyber/Depth',
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === '/') {
      return [{ label: 'Home', href: '/', isLast: true }];
    }

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', href: '/', isLast: false }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Clean segment name for display
      const cleanSegment = segment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/^\d+[\-\s]*/, '') // Remove leading numbers like "00-", "01-"
        .trim();

      breadcrumbs.push({
        label: cleanSegment,
        href: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render navigation items recursively
  const renderNavItem = (item: NavigationItem, level = 0) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.id} className={`nav-item nav-item-level-${level}`}>
        <a
          href={item.href}
          className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
          style={{ paddingRight: `${16 + level * 16}px` }}
        >
          {item.label}
        </a>
        {hasChildren && (
          <ul className="nav-submenu">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Header */}
      <header
        className={`header-sidebar-header ${scrolled ? 'header-scrolled' : ''} ${className}`}
        role="banner"
      >
        <div className="header-content">
          {/* Hamburger Menu Button - Right */}
          <button
            className="hamburger-btn"
            onClick={toggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="main-sidebar"
            aria-label={sidebarOpen ? 'إغلاق القائمة الجانبية' : 'فتح القائمة الجانبية'}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Breadcrumbs - Center */}
          <nav
            className="breadcrumbs-nav"
            aria-label="Breadcrumb"
            role="navigation"
          >
            <ol className="breadcrumbs-list">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="breadcrumb-item">
                  {!crumb.isLast ? (
                    <>
                      <a
                        href={crumb.href}
                        className="breadcrumb-link"
                      >
                        {crumb.label}
                      </a>
                      <span className="breadcrumb-separator" aria-hidden="true">
                        ›
                      </span>
                    </>
                  ) : (
                    <span className="breadcrumb-current" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* GitHub Link - Left */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="عرض على GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="main-sidebar"
        className={`header-sidebar-nav ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        role="navigation"
        aria-label="القائمة الرئيسية"
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-content">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">القائمة الرئيسية</h2>
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="إغلاق القائمة الجانبية"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav" role="navigation">
            <ul className="nav-list">
              {navigation.map(item => renderNavItem(item))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content Spacer - to account for fixed header */}
      <div className="header-spacer" aria-hidden="true" />
    </>
  );
};

export default HeaderSidebar;
