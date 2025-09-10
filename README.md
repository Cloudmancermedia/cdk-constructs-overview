# CDK Constructs Overview
## Overview of Stacks: L1, L2, and L3 Constructs
This project demonstrates how to build similar AWS architectures using three different levels of AWS CDK constructs: L1 (low-level), L2 (higher-level), and L3 (pattern-level). Each stack implements a comparable solution, allowing you to see the differences in abstraction, code complexity, and best practices.

### 1. L1RawStack (Level 1 Constructs)
- **Purpose:** Uses L1 constructs, which are direct representations of AWS CloudFormation resources.
- **Function:** Every resource is defined explicitly, requiring manual configuration of all properties. This approach provides maximum control and flexibility but requires more boilerplate and a deeper understanding of AWS resource details.
- **Use Case:** Ideal for advanced users who need fine-grained control or want to use features not exposed by higher-level constructs.

### 2. L2ServicesStack (Level 2 Constructs)
- **Purpose:** Uses L2 constructs, which are AWS CDK classes that encapsulate common resource configurations.
- **Function:** Resources are easier to define, with sensible defaults and helper methods. L2 constructs reduce boilerplate and simplify resource relationships, while still allowing customization.
- **Use Case:** Recommended for most users, as it balances flexibility and ease of use, making infrastructure code more maintainable.

### 3. L3PatternsStack (Level 3 Constructs)
- **Purpose:** Uses L3 constructs, which are CDK patterns combining multiple resources into opinionated, production-ready architectures.
- **Function:** Entire solutions (such as APIs, event-driven systems, or data pipelines) are provisioned with minimal code. L3 constructs enforce best practices and integrate security, scalability, and reliability by default.
- **Use Case:** Best for rapid prototyping and production deployments where standard patterns are sufficient.

---

By comparing these stacks, you can learn how the AWS CDK’s abstraction levels affect code structure, maintainability, and the speed of development. This project is a practical guide for choosing the right construct level for your use case.

## Commands
* `cdk deploy --profile <profile-name> --all` Deploy the stacks
* `cdk destroy --profile <profile-name> --all` Destroy the stacks