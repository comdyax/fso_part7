import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

let user = null;
let blog = null;
let container = null;
const mockHandler = jest.fn();
const mockHandler2 = jest.fn();

beforeEach(() => {
  user = {
    username: "max",
  };
  blog = {
    title: "its a me",
    author: "mario",
    url: "cart.luigi",
    user: {
      username: "max",
    },
  };
  container = render(
    <Blog
      blog={blog}
      user={user}
      reloadBlogs={mockHandler}
      addLike={mockHandler2}
    />,
  ).container;
});

test("<Blog /> renders only title and author by default", async () => {
  const divDefault = container.querySelector(".defaultValues");
  const divDetails = container.querySelector(".detailValues");

  expect(divDefault).not.toHaveStyle("display: none");
  expect(divDetails).toHaveStyle("display: none");

  const element = screen.getByText("its a me", { exact: false });
  expect(element).toBeDefined();
  const element2 = screen.getByText("mario", { exact: false });
  expect(element2).toBeDefined();
});

test("<Blog /> details are shown when show-details-button is clicked", async () => {
  const client = userEvent.setup();
  const button = screen.getByText("show details");

  await client.click(button);

  const divDefault = container.querySelector(".defaultValues");
  const divDetails = container.querySelector(".detailValues");

  expect(divDefault).not.toHaveStyle("display: none");
  expect(divDetails).not.toHaveStyle("display: none");
});

test("<Blog /> if the likes button is called twice, the handler is called twice", async () => {
  const client = userEvent.setup();

  const likeButton = screen.getByText("like");

  await client.click(likeButton);
  await client.click(likeButton);

  expect(mockHandler2.mock.calls).toHaveLength(2);
});
