import { Dispatch, SetStateAction} from 'react';

export interface ContextProps {
    login:  Dispatch<SetStateAction<[string | null, string | null]>>;
    token: string | undefined;
    fetchAuth:  "" | ((url: string, opts?: RequestInit) => Promise<Response>) | undefined;
    headers: "" | { Authorization: string; } | undefined,
}

export interface ProviderProps {
    children?: React.ReactNode;
}

// const TokenContext = React.createContext<ContextProps>({
//   login: () => {},
//   token: "",
//   fetchAuth: () => {},
//   headers: { Authorization: ""}
// });

export interface Recipe {
    id: string;
    name: string;
    ingredients: string [];
    tools: string [];
    instructions: string [];
}

export interface LoginCredential {
    username: string,
    password: string,
}