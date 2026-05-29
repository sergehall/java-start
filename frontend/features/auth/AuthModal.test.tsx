import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthModalHost, AuthModalProvider, OpenAuthModalButton } from "@/features/auth/AuthModal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

function renderAuthModalEntry() {
  return render(
    <AuthModalProvider>
      <OpenAuthModalButton mode="sign-up">Get started</OpenAuthModalButton>
      <AuthModalHost />
    </AuthModalProvider>
  );
}

describe("AuthModal", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("switches sign-up and sign-in in the same modal with query auth state", async () => {
    const user = userEvent.setup();
    renderAuthModalEntry();

    await user.click(screen.getByRole("button", { name: /get started/i }));

    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(window.location.search).toBe("?auth=sign-up");

    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(screen.getByRole("heading", { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
    expect(window.location.search).toBe("?auth=sign-in");

    await user.click(screen.getByRole("button", { name: /create one/i }));

    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
    expect(window.location.search).toBe("?auth=sign-up");
  });
});
