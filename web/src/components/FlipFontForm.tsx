import React from "react";

export const FlipFontForm = () => {
  return (
    <form action="/api/flip-font" method="post" encType="multipart/form-data">
      <input type="file" name="font" />
      <input type="submit" />
    </form>
  );
};
