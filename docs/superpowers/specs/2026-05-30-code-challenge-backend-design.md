# Code Challenge Backend Design

Date: 2026-05-30

## Goal

Add a fixed Python code challenge practice flow to `/code-challenge` while preserving the current analysis-based challenge flow. The new flow must provide deterministic test-based correction and a separate AI hint button that gives coaching without revealing code.

## Decisions

- Keep the existing analysis-driven endpoints and LLM evaluation behavior intact.
- Add a new fixed catalog of 8 Python challenges.
- Require users to implement a named Python function for each challenge.
- Grade submissions with backend tests, not with an LLM.
- Run submitted code in a subprocess with a short timeout and lightweight AST validation.
- Use the LLM only for hints based on the problem and the user's current code.
- Do not persist submissions in the MVP.

## Challenge Catalog

The backend will expose a static catalog in code, not in the database. Each challenge contains:

- `slug`
- `title`
- `difficulty`
- `category`
- `reason`
- `description`
- `function_name`
- `signature`
- `examples`
- `constraints`
- hidden `test_cases`

The 8 MVP challenges are:

| Category | Challenges |
| --- | --- |
| Array | Best Time to Buy/Sell Stock; Maximum Subarray |
| Two Pointer | Valid Palindrome; Two Sum II |
| Hashmap | Two Sum |
| Sliding Window | Longest Substring Without Repeating Characters |
| Linked List | Reverse Linked List; Merge Two Sorted Lists |

Linked list challenges will use a backend-provided `ListNode` helper. Test inputs use arrays, the harness converts arrays into linked lists before calling the user's function, and return values are serialized back to arrays for comparison.

## API

Add new routes independent of `analysisId`:

- `GET /challenges`
- `GET /challenges/{slug}`
- `POST /challenges/{slug}/submit`
- `POST /challenges/{slug}/hint`

`GET` routes never expose hidden test cases.

`POST /challenges/{slug}/submit` accepts:

```json
{
  "code": "def two_sum(nums, target):\n    ..."
}
```

It returns whether the solution passed, how many tests passed, the total number of tests, and details for only the first failed case.

`POST /challenges/{slug}/hint` accepts the same code payload and returns prose feedback. It must not include a complete solution or code snippets.

## Runner

Define a runner interface so the execution backend can be replaced later:

```python
class CodeRunner(Protocol):
    def run(self, code, challenge) -> RunResult:
        ...
```

The MVP implementation is `LocalPythonSubprocessRunner`.

Execution flow:

1. Parse the submitted code with `ast.parse`.
2. Reject obvious unsafe operations and imports before execution.
3. Write a temporary Python file containing helpers, user code, and the test harness.
4. Run the file in a Python subprocess with a short timeout.
5. Capture stdout as JSON.
6. Return a normalized result to the API.

The AST validation should reject at least:

- imports of `os`, `sys`, `subprocess`, `socket`, and similar system modules
- calls to `open`, `eval`, `exec`, `__import__`, `compile`, `input`, `globals`, `locals`, and `vars`

The MVP security model is intentionally limited. It is acceptable for local development and early demos, but public deployment should move to a stronger isolated runner such as Judge0, Docker-based isolation, or a dedicated execution service.

## Result Policy

Submission feedback should reveal enough for learning without dumping the full hidden test suite.

When tests fail:

- Show `input`, `expected`, and `actual` only for the first failing case.
- Show the total number of tests and passed count.
- Do not reveal the remaining hidden cases.

When execution fails:

- Show a concise error type and message.
- Avoid exposing noisy internal harness details.

When execution times out:

- Return a timeout status and indicate that the solution may contain an infinite loop or inefficient logic.

## AI Hints

Hints are separate from grading. The hint endpoint receives:

- challenge title
- description
- category
- signature
- current user code

The hint prompt must ask for coaching only:

- explain how the user seems to be approaching the problem
- point out missing edge cases or conceptual gaps
- suggest the next idea to investigate
- avoid code, pseudocode that is too close to code, and full solutions

The hint endpoint does not run tests and does not determine correctness.

## Frontend

Update `/code-challenge` to add a fixed practice catalog section using the new `/challenges` endpoints.

The practice experience should include:

- challenge list
- description, examples, constraints, and required signature
- Python editor initialized from `signature`
- submit button for deterministic tests
- hint button for AI coaching
- result panel showing pass/fail, counts, and first failing case details

The existing analysis-based recommendations can remain as a separate section or continue unchanged. They should not block the fixed challenge catalog from working when no analysis is selected.

## Testing

Backend tests should cover:

- catalog returns exactly 8 challenges
- catalog category distribution matches the requirement
- challenge detail does not expose hidden tests
- a correct solution passes
- an incorrect solution fails with first failed case details only
- timeout is handled
- forbidden import or call is rejected
- hint endpoint calls the LLM service with problem and code context

Frontend verification should cover:

- page loads without requiring `analysisId` for the fixed catalog
- selecting a challenge loads the Python stub
- submit displays pass/fail results
- hint displays coaching text

## Non-Goals

- No multi-language support in the MVP.
- No submission history.
- No rankings or scoring system.
- No public-grade sandbox in this implementation.
- No removal of existing analysis-based code challenge behavior.
