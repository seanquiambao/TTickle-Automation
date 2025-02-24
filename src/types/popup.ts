export type Popup = {
  title?: string;
  message?: string | JSX.Element;
  visible: boolean;
  cancel?: boolean;
  submit?: boolean;
};
