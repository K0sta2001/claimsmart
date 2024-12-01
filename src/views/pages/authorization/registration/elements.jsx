import { filterNonLatinInput } from "../../../../utils/FilterInput";

const formInputs = [
  <input
    key="fullName"
    name="fullName"
    placeholder="Full name"
    onChange={filterNonLatinInput}
  />,
  <input
    key="username"
    name="username"
    placeholder="Username"
    onChange={filterNonLatinInput}
  />,
  <input
    key="password"
    name="password"
    placeholder="Password"
    type="password"
    onChange={filterNonLatinInput}
  />,
];

export default formInputs;
