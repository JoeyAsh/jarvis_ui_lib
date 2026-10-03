import { Button, useToast } from '@ui';

export default function WithDescription() {
    const { toast } = useToast();

    return (
        <Button
            variant="primary"
            onClick={() =>
                toast({
                    variant: 'success',
                    title: 'Profile saved',
                    description: 'Your changes are synced to all devices.',
                })
            }
        >
            Save profile
        </Button>
    );
}
