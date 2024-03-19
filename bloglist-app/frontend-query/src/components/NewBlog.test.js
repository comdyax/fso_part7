import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewBlog from "./NewBlog";
import userEvent from "@testing-library/user-event";

test("<NewBlog /> test if the eventHandler as props is called when form is submitted", async () => {
  const mockHandler = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<NewBlog createBlog={mockHandler} />);

  const title = container.querySelector("#title");
  const author = container.querySelector("#author");
  const url = container.querySelector("#url");

  await user.type(title, "oneTwoThree");
  await user.type(author, "fourFiveSix");
  await user.type(url, "sevenEightNine");

  const button = screen.getByText("create Blog");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0].title).toBe("oneTwoThree");
  expect(mockHandler.mock.calls[0][0].author).toBe("fourFiveSix");
  expect(mockHandler.mock.calls[0][0].url).toBe("sevenEightNine");
});
