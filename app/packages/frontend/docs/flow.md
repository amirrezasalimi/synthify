# Flow System Documentation

This document provides an efficient overview of the Flow system, including the key components, block types, and their properties. It also explains the usage of the `prompt` field, dynamic content generation, and block output access.

---

## **1. FlowData Interface**

Represents the overall structure of a flow, including metadata and blocks.

| Property | Type          | Description                      |
| -------- | ------------- | -------------------------------- |
| `id`     | `string`      | Unique identifier for the flow.  |
| `name`   | `string`      | Name of the flow.                |
| `color`  | `string`      | Associated color of the flow.    |
| `blocks` | `FlowBlock[]` | Array of blocks within the flow. |

---

## **2. Block Types and Properties**

### **General Block Structure**

Blocks define specific tasks within a flow. Each block shares core properties:

| Property     | Type        | Description                                                         |
| ------------ | ----------- | ------------------------------------------------------------------- |
| `id`         | `string`    | Unique identifier for the block.                                    |
| `name`       | `string`    | Name of the block.                                                  |
| `type`       | `string`    | Block type (`list`, `llm`, `run-flow`, `merge`, `data`).            |
| `prompt?`    | `string`    | Input or instruction for AI processing, also used in `list` blocks. |
| `settings?`  | `object`    | Settings of each block.                                             |
| `ai_config?` | `AIConfig?` | Configuration for AI services (model, temperature).                 |
| `data?`      | `Data?`     | Stores processed data or results.                                   |
| `order`      | `number`    | Execution order of blocks within the flow.                          |

### **Block-Specific Properties**

#### 1. **List Block (`type: "list"`)**

- **Description:** Processes lists, allowing item separation and prompt usage.
- **Unique Properties:**
  | Property | Type | Description |
  |-------------------|----------|----------------------------------------------|
  | `item_seperator?` | `string?`| Defines how to split items in the list. |

#### 2. **LLM Block (`type: "llm"`)**

- **Description:** Interacts with large language models for AI-driven processing.
- **Note:** Uses the `prompt` field for dynamic AI inputs and parses results as JSON if `settings.response_type` is set to `"json"`.

#### 3. **Run-Flow Block (`type: "run-flow"`)**

- **Description:** Executes another flow within the current flow.
- **Unique Properties:**
  | Property | Type | Description |
  |-------------------|----------|----------------------------------------------|
  | `selected_flow?` | `string?`| Specifies the flow to be executed. |

#### 4. **Merge Block (`type: "merge"`)**

- **Description:** Merges the output of multiple blocks or flows.
- **Note:** Uses the `prompt` field for dynamic content generation.

#### 5. **Data Block (`type: "data"`)**

- **Description:** Manages input/output of data in various formats.
- **Unique Properties:**
  | Property | Type | Description |
  |-------------------|-------------------------------|----------------------------------------------|
  | `data_type?` | `"json" \| "text" \| "parquet"`| Data format for the block. |
  | `data_from?` | `"file" \| "hugginface" \| "raw"`| Source of the data. |
  | `data_raw?` | `string?` | Raw data if `data_from` is set to "raw". |

---

## **3. Prompt Field and Dynamic Access**

- **Available in:** `llm`, `merge`, and `list` blocks.
- **Pattern Usage:**
  - **Access Previous Blocks:** Use `{{blockName}}` to access the output of a previous block.
  - **Nested Flow Access:** Use `{{flowName.blockName}}` to access output from nested flows.
  - **JavaScript in Prompts:** You can embed JavaScript expressions inside `{{}}` for dynamic content generation. Example: `{{Math.random()}}`.

### **Special Expressions**

- **Avoid Expression Handling:** Use `#NO_EXP` and `#END_NO_EXP` to keep content within `{{}}` unprocessed by JavaScript.

---

## **4. Sample Usages**

### **List Block Example**

```javascript
// Item separation
{
  prompt: "Process this list: {item1}, {item2}, {item3}",
  settings: {
    item_seperator: ", "
  }
}
```

### **LLM Block Example**

```javascript
// Dynamic AI input with JSON parsing
{
  prompt: "What is the weather like today?",
  settings: {
    response_type: "json"
  }
}
```

### **Merge Block Example**

```javascript
// Merging outputs from previous blocks
{
  prompt: "Combine results: {blockA}, {blockB}",
}
```

---

## **5. Block Outputs**

- **Access Output:** The output of all blocks is available to their next blocks using the pattern `{}`.

Here’s the additional section on caching for your Flow system documentation:

---

## **6. Caching Mechanism**

### **Description**

Caching allows for the storage of the output of blocks, preventing redundant processing. This is particularly beneficial for blocks that interact with large language models (LLMs), as it can significantly enhance performance and reduce costs.

### **Usage**

- **Enable Caching:** Each block has a `cache` property in its `settings` object that can be set to `true` to enable caching.
- **Behavior:** When caching is enabled:
  - The output of the block is stored after the first execution.
  - Subsequent requests for the same block output will retrieve the cached result instead of regenerating it.

### **Example**

```javascript
{
  type: "llm",
  prompt: "Generate a summary of the following text.",
  settings: {
    cache: true
  }
}
```

In this example, if the same prompt is processed again, the system will return the cached output instead of reprocessing the request through the LLM.
