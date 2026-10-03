export type LandingFeatureIcon = 'grid' | 'orbit' | 'sound' | 'palette' | 'typed' | 'light';

export interface LandingFeature {
    icon: LandingFeatureIcon;
    title: string;
    text: string;
}
