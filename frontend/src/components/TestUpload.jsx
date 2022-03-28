import React from "react";
import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation ($file: Upload!) {
    testUpload(file: $file)
  }
`;

export function TestUpload() {
    const [mutate] = useMutation(MUTATION);

    function onChange({
        target: {
          validity,
          files: [file],
        },
      }) {
        console.log(file);
        if (validity.valid) mutate({ variables: { file } });
    }

    return (
        <div>
            <input type="file" required onChange={onChange} />;
        </div>
    )
}