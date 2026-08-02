import { createContext, useContext, type FC, type ReactNode } from 'react';

const FormWizardLayoutContext = createContext<number | undefined>(undefined);

type FormWizardLayoutProviderProps = {
    totalSteps: number;
    children: ReactNode;
};

export const FormWizardLayoutProvider: FC<FormWizardLayoutProviderProps> = ({
    totalSteps,
    children,
}) => (
    <FormWizardLayoutContext.Provider value={totalSteps}>
        {children}
    </FormWizardLayoutContext.Provider>
);

export const useFormWizardTotalSteps = (): number | undefined =>
    useContext(FormWizardLayoutContext);
