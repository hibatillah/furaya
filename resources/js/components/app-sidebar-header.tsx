import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="ml-auto size-8"
                onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme"
            >
                {appearance === 'dark' ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
            </Button>
        </header>
    );
}
