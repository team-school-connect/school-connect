import React from "react";
import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation ($assignmentId: String, $file: Upload!) {
    submitAssignment(assignmentId: $assignmentId, file: $file)
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
        // console.log(file);
        if (validity.valid) mutate({ variables: { assignmentId: String("6240d51b35cbd6b83920f833"), file } });
    }

    return (
        <div>
            <input type="file" required onChange={onChange} />;
        </div>
    )
}