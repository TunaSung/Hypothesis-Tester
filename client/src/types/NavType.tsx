export interface NavItem {
  id: "analyze" | "history" | "docs" | "about" | "signin" | "signout";
  label: string;
  to: string;
  onClick?: () => void;
}
