import React from "react";

const {{pascalCase name}}: React.FunctionComponent<{{pascalCase name}}Props> = (props: {{pascalCase name}}Props) => {
  const { someProp } = props;

  return <div>{someProp}</div>;
};

interface {{pascalCase name}}Props {
  someProp?: string;
}

export default {{pascalCase name}};
