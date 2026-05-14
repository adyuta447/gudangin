import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md" style={{ backgroundColor: '#cc785c' }}>
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                    Gudangin
                </span>
            </div>
        </>
    );
}
