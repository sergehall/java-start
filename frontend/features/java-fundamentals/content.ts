export type JavaFundamentalsIcon =
  | "binary"
  | "book"
  | "boxes"
  | "braces"
  | "database"
  | "gitBranch"
  | "layers"
  | "lock"
  | "network"
  | "server"
  | "shield"
  | "sparkles"
  | "testTube";

export type JavaExample = Readonly<{
  id: string;
  title: string;
  goal: string;
  code: string;
  notes: readonly string[];
}>;

export type JavaArchitectureLink = Readonly<{
  title: string;
  description: string;
  href: string;
}>;

export type JavaModule = Readonly<{
  id: string;
  iconName: JavaFundamentalsIcon;
  label: string;
  title: string;
  summary: string;
  details: string;
  topics: readonly string[];
  outcomes: readonly string[];
  practice: string;
  accentClass: string;
  exampleIds: readonly string[];
  architectureLinks: readonly JavaArchitectureLink[];
}>;

export type FoundationPillar = Readonly<{
  id: string;
  iconName: JavaFundamentalsIcon;
  label: string;
  text: string;
  description: string;
  principles: readonly string[];
  exampleId: string;
  architectureLinks: readonly JavaArchitectureLink[];
}>;

export type JavaFundamentalsTopic =
  | Readonly<{
      kind: "module";
      module: JavaModule;
      examples: readonly JavaExample[];
    }>
  | Readonly<{
      kind: "pillar";
      pillar: FoundationPillar;
      examples: readonly JavaExample[];
    }>;

export type JavaModuleMapColumns = Readonly<{
  primary: readonly JavaModule[];
  secondary: readonly JavaModule[];
}>;

export const javaExamples: readonly JavaExample[] = [
  {
    id: "language-core-guard",
    title: "Language Core: Validate Before Branching",
    goal: "Keep control flow explicit and protect the method boundary before the business decision starts.",
    code: `public final class GradeClassifier {
    public String classify(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Score must be between 0 and 100.");
        }

        if (score >= 90) {
            return "excellent";
        }
        if (score >= 70) {
            return "solid";
        }
        if (score >= 50) {
            return "needs_practice";
        }

        return "restart_module";
    }
}`,
    notes: [
      "The input boundary is checked once at the top.",
      "Each branch has one clear reason to exist.",
      "The returned values are stable strings that can later become an enum."
    ]
  },
  {
    id: "oop-learning-plan",
    title: "OOP: Immutable Domain Model",
    goal: "Model behavior with small immutable objects and keep business rules out of controllers.",
    code: `import java.util.List;

public record LearningModule(String id, String title, int estimatedMinutes) {
    public LearningModule {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Module id is required.");
        }
        if (estimatedMinutes <= 0) {
            throw new IllegalArgumentException("Estimated minutes must be positive.");
        }
    }
}

public final class LearningPlan {
    private final List<LearningModule> modules;

    public LearningPlan(List<LearningModule> modules) {
        this.modules = List.copyOf(modules);
    }

    public int totalMinutes() {
        return modules.stream()
            .mapToInt(LearningModule::estimatedMinutes)
            .sum();
    }
}`,
    notes: [
      "The record owns basic invariants.",
      "List.copyOf prevents external mutation.",
      "The domain object exposes behavior, not only data."
    ]
  },
  {
    id: "collections-tag-index",
    title: "Collections: Tag Index",
    goal: "Choose collections by access pattern instead of habit.",
    code: `import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class ModuleTagIndex {
    public Map<String, Set<String>> buildIndex(List<LearningModule> modules) {
        Map<String, Set<String>> index = new HashMap<>();

        for (LearningModule module : modules) {
            for (String tag : module.tags()) {
                index.computeIfAbsent(tag, ignored -> new HashSet<>())
                    .add(module.id());
            }
        }

        return Map.copyOf(index);
    }
}`,
    notes: [
      "HashMap gives fast lookup by tag.",
      "Set prevents duplicate module ids.",
      "The final map is copied before leaving the method."
    ]
  },
  {
    id: "safe-email-value",
    title: "Safety: Value Object Validation",
    goal: "Validate untrusted input once and pass a trusted type deeper into the application.",
    code: `public record EmailAddress(String value) {
    public EmailAddress {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Email address is required.");
        }
        if (!value.matches("^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$")) {
            throw new IllegalArgumentException("Email address format is invalid.");
        }
    }

    public String normalized() {
        return value.trim().toLowerCase();
    }
}`,
    notes: [
      "Invalid data cannot enter the domain silently.",
      "The error message is safe for a user-facing response.",
      "Normalization is centralized instead of repeated across services."
    ]
  },
  {
    id: "types-memory-model",
    title: "Types: Values And References",
    goal: "Show how primitives hold values while object variables hold references to data on the heap.",
    code: `import java.util.ArrayList;
import java.util.List;

public final class ReferenceDemo {
    public void run() {
        int originalCount = 3;
        int copiedCount = originalCount;
        copiedCount++;

        List<String> originalTopics = new ArrayList<>();
        originalTopics.add("types");

        List<String> sharedTopics = originalTopics;
        sharedTopics.add("references");

        System.out.println(originalCount);      // 3
        System.out.println(copiedCount);        // 4
        System.out.println(originalTopics.size()); // 2
    }
}`,
    notes: [
      "Primitive assignment copies the value.",
      "Object assignment copies the reference, not the object itself.",
      "Mutable shared references are a common source of surprising behavior."
    ]
  },
  {
    id: "safety-secret-redaction",
    title: "Safety: Redact Secrets Before Logging",
    goal: "Keep sensitive values out of logs while preserving useful diagnostic context.",
    code: `import java.util.Map;
import java.util.Set;

public final class SafeAuditLog {
    private static final Set<String> SECRET_KEYS = Set.of("password", "token", "apiKey");

    public Map<String, String> redact(Map<String, String> attributes) {
        return attributes.entrySet().stream()
            .collect(java.util.stream.Collectors.toUnmodifiableMap(
                Map.Entry::getKey,
                entry -> SECRET_KEYS.contains(entry.getKey()) ? "[REDACTED]" : entry.getValue()
            ));
    }
}`,
    notes: [
      "The allowlist of secret keys is centralized.",
      "The returned map is immutable.",
      "Operational logs stay useful without exposing credentials."
    ]
  },
  {
    id: "api-domain-boundary",
    title: "API: Request DTO To Domain Command",
    goal: "Convert HTTP payloads into application commands before domain logic runs.",
    code: `import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateModuleRequest(
    @NotBlank String title,
    @Size(max = 400) String summary
) {
    public CreateModuleCommand toCommand(UserId ownerId) {
        return new CreateModuleCommand(ownerId, title.trim(), summary.trim());
    }
}

public record CreateModuleCommand(UserId ownerId, String title, String summary) {
}`,
    notes: [
      "Validation annotations stay on the HTTP DTO.",
      "The command is independent from the web framework.",
      "The domain receives a typed owner id instead of trusting a raw request value."
    ]
  },
  {
    id: "streams-progress",
    title: "Streams: Progress Projection",
    goal: "Use Stream API for clear transformations while keeping side effects outside the pipeline.",
    code: `import java.util.List;

public final class ProgressCalculator {
    public int completionPercent(List<ModuleProgress> progress) {
        if (progress.isEmpty()) {
            return 0;
        }

        long completed = progress.stream()
            .filter(ModuleProgress::completed)
            .count();

        return (int) ((completed * 100) / progress.size());
    }
}`,
    notes: [
      "The stream expresses a read-only projection.",
      "The empty list case is explicit.",
      "Integer math is acceptable because the output is a whole percent."
    ]
  },
  {
    id: "jdbc-prepared-statement",
    title: "Persistence: PreparedStatement Boundary",
    goal: "Prevent SQL injection and close resources predictably.",
    code: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class UserProfileRepository {
    public UserProfile findByEmail(Connection connection, EmailAddress email) throws SQLException {
        String sql = """
            SELECT id, username, email
            FROM user_profiles
            WHERE email = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email.normalized());

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new ProfileNotFoundException("Profile was not found.");
                }

                return mapProfile(resultSet);
            }
        }
    }
}`,
    notes: [
      "PreparedStatement keeps data separate from SQL syntax.",
      "try-with-resources closes JDBC objects reliably.",
      "The repository maps database details into an application object."
    ]
  },
  {
    id: "spring-thin-controller",
    title: "API: Thin Spring Boot Controller",
    goal: "Keep HTTP concerns in the controller and business rules in the service layer.",
    code: `import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/learning-modules")
public final class LearningModuleController {
    private final LearningModuleService service;

    public LearningModuleController(LearningModuleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LearningModuleResponse> create(@Valid @RequestBody CreateLearningModuleRequest request) {
        LearningModuleResponse response = service.create(request);
        return ResponseEntity.status(201).body(response);
    }
}`,
    notes: [
      "The controller handles routing, validation, and HTTP status mapping.",
      "The service owns the use case.",
      "The endpoint name is versioned and resource-oriented."
    ]
  },
  {
    id: "junit-focused-tests",
    title: "Tests: Focused JUnit 5 Coverage",
    goal: "Test behavior through normal, edge, invalid, and security-relevant cases.",
    code: `import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

final class GradeClassifierTest {
    private final GradeClassifier classifier = new GradeClassifier();

    @Test
    void shouldReturnExcellentWhenScoreIsAtLeastNinety() {
        assertEquals("excellent", classifier.classify(94));
    }

    @Test
    void shouldRejectScoreBelowAllowedRange() {
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> classifier.classify(-1)
        );

        assertEquals("Score must be between 0 and 100.", exception.getMessage());
    }
}`,
    notes: [
      "Test names describe behavior in business language.",
      "The invalid case verifies the exception type and message.",
      "No sleeps, ordering assumptions, or external services are needed."
    ]
  },
  {
    id: "tests-boundary-matrix",
    title: "Tests: Boundary Case Matrix",
    goal: "Make the expected behavior obvious by covering normal, edge, and invalid inputs together.",
    code: `import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

final class ScorePolicyTest {
    private final GradeClassifier classifier = new GradeClassifier();

    @ParameterizedTest
    @CsvSource({
        "100, excellent",
        "90, excellent",
        "70, solid",
        "50, needs_practice"
    })
    void shouldClassifyAllowedScores(int score, String expected) {
        assertEquals(expected, classifier.classify(score));
    }

    @ParameterizedTest
    @CsvSource({ "-1", "101" })
    void shouldRejectScoresOutsideAllowedRange(int score) {
        assertThrows(IllegalArgumentException.class, () -> classifier.classify(score));
    }
}`,
    notes: [
      "Parameterized tests remove repetitive test bodies.",
      "Boundary values document the contract more clearly than random examples.",
      "Invalid cases stay focused on externally visible behavior."
    ]
  }
];

export const javaModules: readonly JavaModule[] = [
  {
    id: "language-core",
    iconName: "braces",
    label: "Module 01",
    title: "Language Core",
    summary: "Syntax, entry point, variables, types, operators, and control flow.",
    details:
      "This module builds the mental model for Java execution: how code enters main, how values move through methods, and how branches express decisions. The main goal is to write small methods with clear inputs, clear outputs, and predictable failure behavior.",
    topics: ["class and main", "primitive/reference types", "if/switch/loops", "methods and scope"],
    outcomes: [
      "Explain the difference between primitive values and object references.",
      "Extract readable methods instead of growing one large main method.",
      "Validate method inputs before branching into business logic."
    ],
    practice: "Build a console calculator with input validation.",
    accentClass: "border-t-brand",
    exampleIds: ["language-core-guard"],
    architectureLinks: [
      {
        title: "Java domain model",
        description: "Primitive values, references, branches, and methods become the vocabulary of the domain layer.",
        href: "/architecture#domain-model"
      }
    ]
  },
  {
    id: "oop",
    iconName: "boxes",
    label: "Module 02",
    title: "OOP And Domain Modeling",
    summary: "Classes, encapsulation, inheritance, polymorphism, interfaces, records, and enums.",
    details:
      "This module turns syntax into design. Classes should protect their own state, records should model immutable values, and interfaces should describe meaningful behavior instead of existing only because a pattern said so.",
    topics: ["constructor invariants", "composition over inheritance", "interfaces", "records/enums"],
    outcomes: [
      "Place business rules close to the data they protect.",
      "Prefer composition when inheritance would create fragile coupling.",
      "Use records and enums for small, stable domain concepts."
    ],
    practice: "Model a learning profile without Spring dependencies.",
    accentClass: "border-t-mint",
    exampleIds: ["oop-learning-plan"],
    architectureLinks: [
      {
        title: "Spring Boot application",
        description: "Domain objects stay clean while services orchestrate use cases around them.",
        href: "/architecture#spring-application"
      },
      {
        title: "Java domain model",
        description: "Records, classes, and invariants protect the business language of the project.",
        href: "/architecture#domain-model"
      }
    ]
  },
  {
    id: "collections",
    iconName: "layers",
    label: "Module 03",
    title: "Collections And Generics",
    summary: "ArrayList, HashMap, Set, Queue, equals/hashCode, generics, and data structure selection.",
    details:
      "Collections are design decisions. The right collection makes code easier to read and faster enough by default. Generics make those decisions type-safe so mistakes fail at compile time instead of production.",
    topics: ["List/Set/Map", "iteration", "equals/hashCode", "generic constraints"],
    outcomes: [
      "Choose List, Set, or Map based on lookup and uniqueness requirements.",
      "Understand why equals and hashCode matter for hash-based collections.",
      "Use generics to remove unsafe casts."
    ],
    practice: "Build a module catalog with tag-based search.",
    accentClass: "border-t-blue",
    exampleIds: ["collections-tag-index"],
    architectureLinks: [
      {
        title: "Java domain model",
        description: "Collections shape catalogs, tags, profile state, and in-memory projections.",
        href: "/architecture#domain-model"
      }
    ]
  },
  {
    id: "errors",
    iconName: "shield",
    label: "Module 04",
    title: "Exceptions And Safe Input",
    summary: "Checked and unchecked exceptions, try-with-resources, user-safe errors, and boundary protection.",
    details:
      "Error handling is part of the API contract. Code should reject invalid input early, avoid leaking internal details, and preserve original exceptions when wrapping technical failures.",
    topics: ["specific exceptions", "try-with-resources", "input validation", "user-safe messages"],
    outcomes: [
      "Throw specific exceptions with clear safe messages.",
      "Avoid empty catch blocks and generic exception swallowing.",
      "Close external resources with try-with-resources."
    ],
    practice: "Handle invalid input without exposing stack traces to users.",
    accentClass: "border-t-[#b9891f]",
    exampleIds: ["safe-email-value"],
    architectureLinks: [
      {
        title: "Secure session boundary",
        description: "Input validation and user-safe failures protect the edge of the application.",
        href: "/architecture#session-boundary"
      }
    ]
  },
  {
    id: "streams",
    iconName: "gitBranch",
    label: "Module 05",
    title: "Functional Style",
    summary: "Lambdas, Stream API, Optional, and pure data transformations without hidden side effects.",
    details:
      "Functional style is strongest when it clarifies data transformation. Streams should read like a pipeline, Optional should model absence deliberately, and side effects should stay at the boundary.",
    topics: ["map/filter/reduce", "Collectors", "Optional", "method references"],
    outcomes: [
      "Use streams for projection, filtering, grouping, and aggregation.",
      "Avoid mutating external state inside stream pipelines.",
      "Use Optional at return boundaries where absence is expected."
    ],
    practice: "Calculate module progress with the Stream API.",
    accentClass: "border-t-brand",
    exampleIds: ["streams-progress"],
    architectureLinks: [
      {
        title: "Java domain model",
        description: "Functional transformations keep projections readable without hidden side effects.",
        href: "/architecture#domain-model"
      }
    ]
  },
  {
    id: "io-persistence",
    iconName: "database",
    label: "Module 06",
    title: "I/O, JDBC, And Persistence",
    summary: "Files, encodings, PreparedStatement, transactions, and a basic repository model.",
    details:
      "Persistence code talks to the outside world, so it must be explicit about encoding, resource lifecycle, SQL parameters, and transaction boundaries. Repositories should hide storage mechanics from application services.",
    topics: ["Path/Files", "UTF-8", "PreparedStatement", "transactions"],
    outcomes: [
      "Use Path and Files for file access instead of string paths.",
      "Use PreparedStatement for every user-controlled database value.",
      "Keep SQL and mapping logic inside repository boundaries."
    ],
    practice: "Store learning notes in a file or PostgreSQL without SQL injection.",
    accentClass: "border-t-mint",
    exampleIds: ["jdbc-prepared-statement"],
    architectureLinks: [
      {
        title: "PostgreSQL and repositories",
        description: "Persistence code owns SQL, mapping, transactions, and resource lifecycle.",
        href: "/architecture#persistence-boundary"
      }
    ]
  },
  {
    id: "testing",
    iconName: "testTube",
    label: "Module 07",
    title: "JUnit 5 And Quality",
    summary: "Unit tests, edge cases, security cases, test doubles, and behavior-focused verification.",
    details:
      "Tests document the contract. A good test suite covers the happy path, edge cases, invalid input, exceptions, and security-sensitive boundaries without depending on execution order.",
    topics: ["normal/edge/invalid cases", "assertions", "test doubles", "coverage by risk"],
    outcomes: [
      "Name tests by expected behavior.",
      "Keep tests deterministic and fast.",
      "Use fakes or test doubles when real infrastructure is not the behavior under test."
    ],
    practice: "Cover the profile service with valid and invalid scenarios.",
    accentClass: "border-t-blue",
    exampleIds: ["junit-focused-tests"],
    architectureLinks: [
      {
        title: "Focused test loop",
        description: "Tests prove behavior at the unit, API, security, and persistence boundaries.",
        href: "/architecture#quality-loop"
      }
    ]
  },
  {
    id: "spring-boot",
    iconName: "server",
    label: "Module 08",
    title: "Spring Boot Basics",
    summary: "Controllers, services, repositories, DTOs, validation, security filter chains, and thin HTTP boundaries.",
    details:
      "Spring Boot should organize application boundaries, not replace design. Controllers translate HTTP, services orchestrate use cases, repositories talk to storage, and domain code should remain testable without Spring.",
    topics: ["thin controllers", "application services", "DTO validation", "Spring Security"],
    outcomes: [
      "Keep controllers thin and request-focused.",
      "Validate DTOs before calling application services.",
      "Protect endpoints with authentication and authorization checks."
    ],
    practice: "Add a secure API endpoint with a test and a clear error response.",
    accentClass: "border-t-[#b9891f]",
    exampleIds: ["spring-thin-controller"],
    architectureLinks: [
      {
        title: "Spring Boot application",
        description: "Controllers, DTOs, services, repositories, and security filters form the Java backend boundary.",
        href: "/architecture#spring-application"
      },
      {
        title: "Next.js UI and routes",
        description: "HTTP contracts connect the frontend route layer to the backend API.",
        href: "/architecture#browser-interface"
      }
    ]
  }
];

export const foundationPillars: readonly FoundationPillar[] = [
  {
    id: "types",
    iconName: "binary",
    label: "Types",
    text: "understand memory, references, and values",
    description:
      "Types are the first safety net. They help you communicate intent, separate values from references, and catch invalid assignments before the application runs.",
    principles: [
      "Use primitives for simple values and objects for concepts with behavior.",
      "Prefer immutable value objects when data crosses boundaries.",
      "Let method signatures communicate what the caller must provide."
    ],
    exampleId: "types-memory-model",
    architectureLinks: [
      {
        title: "Java domain model",
        description: "Types make project concepts explicit before they cross service and persistence boundaries.",
        href: "/architecture#domain-model"
      }
    ]
  },
  {
    id: "safety",
    iconName: "lock",
    label: "Safety",
    text: "validate input and protect secrets",
    description:
      "Safety starts where data enters the system. Validate early, avoid logging secrets, and convert untrusted strings into trusted domain types.",
    principles: [
      "Treat request payloads, files, database values, and environment values as untrusted.",
      "Return safe error messages and keep stack traces in logs only.",
      "Use allowlists and parameterized queries for risky boundaries."
    ],
    exampleId: "safety-secret-redaction",
    architectureLinks: [
      {
        title: "Secure session boundary",
        description: "Validation, cookies, authorization, and secret handling meet at the security edge.",
        href: "/architecture#session-boundary"
      }
    ]
  },
  {
    id: "api",
    iconName: "network",
    label: "API",
    text: "keep HTTP boundaries separate from the domain",
    description:
      "A clean API boundary keeps web concerns from leaking into business rules. HTTP status codes, DTOs, and validation belong near controllers; decisions belong in services and domain objects.",
    principles: [
      "Use resource-oriented endpoint names and explicit versioning.",
      "Keep controllers thin and delegate use cases to application services.",
      "Do not trust client-side authorization decisions."
    ],
    exampleId: "api-domain-boundary",
    architectureLinks: [
      {
        title: "Next.js UI and routes",
        description: "The frontend calls explicit server-side boundaries instead of reaching into domain logic.",
        href: "/architecture#browser-interface"
      },
      {
        title: "Spring Boot application",
        description: "Java controllers translate HTTP while services keep business behavior framework-independent.",
        href: "/architecture#spring-application"
      }
    ]
  },
  {
    id: "tests",
    iconName: "sparkles",
    label: "Tests",
    text: "prove behavior with focused tests",
    description:
      "Tests turn learning into evidence. Each important rule should have a normal case, edge case, invalid case, and security-relevant case when the boundary is sensitive.",
    principles: [
      "Test behavior, not private implementation details.",
      "Keep unit tests fast and deterministic.",
      "Broaden to integration tests when persistence, security, or transactions are part of the risk."
    ],
    exampleId: "tests-boundary-matrix",
    architectureLinks: [
      {
        title: "Focused test loop",
        description: "Tests connect learning goals to proof at the exact project boundary under risk.",
        href: "/architecture#quality-loop"
      }
    ]
  }
];

export function getJavaExample(exampleId: string) {
  return javaExamples.find((example) => example.id === exampleId) ?? null;
}

export function findJavaExample(exampleId: string) {
  return getJavaExample(exampleId) ?? javaExamples[0];
}

export function getJavaFundamentalsTopic(topicId: string): JavaFundamentalsTopic | null {
  const javaModule = javaModules.find((item) => item.id === topicId);
  if (javaModule) {
    return {
      kind: "module",
      module: javaModule,
      examples: javaModule.exampleIds.map(findJavaExample)
    };
  }

  const pillar = foundationPillars.find((item) => item.id === topicId);
  if (pillar) {
    return {
      kind: "pillar",
      pillar,
      examples: [findJavaExample(pillar.exampleId)]
    };
  }

  return null;
}

export const javaFundamentalsTopicIds = [
  ...javaModules.map((module) => module.id),
  ...foundationPillars.map((pillar) => pillar.id)
] as const;

export function getJavaModuleMapColumns(modules: readonly JavaModule[] = javaModules): JavaModuleMapColumns {
  const midpoint = Math.ceil(modules.length / 2);

  return {
    primary: modules.slice(0, midpoint),
    secondary: modules.slice(midpoint)
  };
}
