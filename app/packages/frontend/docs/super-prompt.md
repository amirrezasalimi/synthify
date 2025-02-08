based on provided document,
make a workflow for provided user prompt for synthesizing any dataset with llms or without them .
- first reason user's and our needs.
- - provide detailed reasoning about each block you want use by purpose and it's relation to other blocks.
- no need to provide ai config for now.
- make sure orders and workflow is correct.
- ignore using data block type.
- after reasoning , provide a json list of flows for given task prompt.
- only use kebab_case for naming. only a-z 0-9 and _
- avoid doing batch stuff in one block.
- attention to each block settings and example before using them.
- only use cache for things you want keep for next data generating.
- use can use js expressions for random stuff too .
- the flows you making , will run multiple time like 100x for making 100x data pair.
- don't use cache until you want that block output keep in next synthesizing too. ( like good for one time static stuff )
- you can't ask llm's to randomize stuff for you , that's not their job , do it with js if needed.
- make sure attention to every detail of samples to learn and use if needed.
- make sure always there is "main" flow , and there should be also "output" merge block as last block in main flow for sure.
-  split big flows to multiple.
- when you making another flow , you can only access their value if you just run-flow in last block.
- and if you want access to a block it's in another flow , first run it in last block , then access by {flowName.blockName} pattern.
- make sure explain to ai , to not too much and only respond in the way you asked , without any talk or message.
- always explain to ai to not talk too much and only respond in the format you asked  ( very important )
```

# Flow System Documentation

This document provides an efficient overview of the Flow system, including the key components, block types, and their properties. It also explains the usage of the `prompt` field, dynamic content generation, and block output access.

---

## **1. FlowData Interface**

Represents the overall structure of a flow, including metadata and blocks.

| Property  | Type         | Description                                 |
|-----------|--------------|---------------------------------------------|
| `id`      | `string`     | Unique identifier for the flow.             |
| `name`    | `string`     | Name of the flow.                           |
| `color`   | `string`     | Associated color of the flow.               |
| `blocks`  | `FlowBlock[]`| Array of blocks within the flow.            |

---

## **2. Block Types and Properties**

### **General Block Structure**
Blocks define specific tasks within a flow. Each block shares core properties:

| Property       | Type            | Description                                             |
|----------------|-----------------|---------------------------------------------------------|
| `id`           | `string`        | Unique identifier for the block.                        |
| `name`         | `string`        | Name of the block.                                      |
| `type`         | `string`        | Block type (`list`, `llm`, `run-flow`, `merge`, `data`). |
| `prompt?`      | `string`        | Input or instruction for AI processing, also used in `list` blocks. |
| `settings?`    | `object`        | Settings of each block.                                 |
| `ai_config?`   | `AIConfig?`     | Configuration for AI services (model, temperature).    |
| `data?`        | `Data?`         | Stores processed data or results.                       |
| `order`        | `number`        | Execution order of blocks within the flow.              |

### **Block-Specific Properties**

#### 1. **List Block (`type: "list"`)**
- **Description:** Processes lists, allowing item separation and prompt usage.
- **Unique Properties:**
  | Property          | Type     | Description                                  |
  |-------------------|----------|----------------------------------------------|
  | `item_seperator?`  | `string?`| Defines how to split items in the list.      |

#### 2. **LLM Block (`type: "llm"`)**
- **Description:** Interacts with large language models for AI-driven processing.
- **Note:** Uses the `prompt` field for dynamic AI inputs and parses results as JSON if `settings.response_type` is set to `"json"`.

#### 3. **Run-Flow Block (`type: "run-flow"`)**
- **Description:** Executes another flow within the current flow.
- **Unique Properties:**
  | Property          | Type     | Description                                  |
  |-------------------|----------|----------------------------------------------|
  | `selected_flow?`   | `string?`| Specifies the flow to be executed.           |

#### 4. **Merge Block (`type: "merge"`)**
- **Description:** Merges the output of multiple blocks or flows.
- **Note:** Uses the `prompt` field for dynamic content generation.

#### 5. **Data Block (`type: "data"`)**
- **Description:** Manages input/output of data in various formats.
- **Unique Properties:**
  | Property          | Type                          | Description                                  |
  |-------------------|-------------------------------|----------------------------------------------|
  | `data_type?`       | `"json" \| "text" \| "parquet"`| Data format for the block.                   |
  | `data_from?`       | `"file" \| "hugginface" \| "raw"`| Source of the data.                        |
  | `data_raw?`        | `string?`                     | Raw data if `data_from` is set to "raw".     |

---

## **3. Prompt Field and Dynamic Access**

- **Available in:** `llm`, `merge`, and `list` blocks.
- **Pattern Usage:**
  - **Access Previous Blocks:** Use `{blockName}` to access the output of a previous block.
  - **Nested Flow Access:** Use `{flowName.blockName}` to access output from nested flows.
  - **JavaScript in Prompts:** You can embed JavaScript expressions inside `{}` for dynamic content generation. Example: `{Math.random()}`.
  
### **Special Expressions**
- **Avoid Expression Handling:** Use `#NO_EXP` and `#END_NO_EXP` to keep content within `{}` unprocessed by JavaScript.

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
```

## samples:
-- typescript json extraction flows:
```
{
"flows": {
        "UtCWAc0O": {
          "data": {
            "blocks": [
              {
                "ai_config": {},
                "id": "svnWpj0q",
                "name": "selected",
                "order": -2,
                "prompt": "{rand(data)}",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "merge"
              },
              {
                "ai_config": {},
                "id": "3khbVBsa",
                "name": "data",
                "order": -3,
                "prompt": "",
                "settings": {
                  "data_from": "raw",
                  "data_raw": "[\n    \"Science Fiction Books\",\n    \"Romance Novels\",\n    \"Historical Documentaries\",\n    \"Organic Cooking\",\n    \"Indie Music\",\n    \"Luxury Cars\",\n    \"Basketball Players\",\n    \"Modern Art\",\n    \"International Cuisine\",\n    \"Space Exploration\",\n    \"Gardening Tips\",\n    \"Wildlife Photography\",\n    \"Video Game Consoles\",\n    \"Ancient History\",\n    \"Mountain Biking\",\n    \"Board Games\",\n    \"Middle Eastern Politics\",\n    \"Jazz Music\",\n    \"3D Animation\",\n    \"Vegan Recipes\",\n    \"Fantasy Movies\",\n    \"Smart Home Devices\",\n    \"DIY Furniture\",\n    \"French Language Learning\",\n    \"Marathon Training\",\n    \"High Fashion\",\n    \"Buddhism\",\n    \"Amateur Radio\",\n    \"Cryptocurrency\",\n    \"Pet Care for Cats\",\n    \"Stand-up Comedy\",\n    \"Woodworking\",\n    \"Mental Health Awareness\",\n    \"Hiking Trails\",\n    \"Virtual Reality\",\n    \"Classical Concerts\",\n    \"Coding Tutorials\",\n    \"Sustainable Living\",\n    \"Bird Watching\",\n    \"World War II\",\n    \"Craft Brewing\",\n    \"Robotics\",\n    \"Yoga Practices\",\n    \"Extreme Sports\",\n    \"Poetry Slams\",\n    \"Arctic Expeditions\",\n    \"Desert Landscapes\",\n    \"Sailing Adventures\",\n    \"Choral Music\",\n    \"Mathematical Theories\",\n    \"Vintage Clothing\",\n    \"Aquarium Care\",\n    \"Street Photography\",\n    \"Skateboarding\",\n    \"Silent Films\",\n    \"Opera Performances\",\n    \"Weightlifting\",\n    \"Traditional Tattoos\",\n    \"Mystery Novels\",\n    \"Virtual Teaching\",\n    \"Holiday Decorations\",\n    \"Tabletop Roleplaying Games\",\n    \"Public Speaking\",\n    \"Acoustic Engineering\",\n    \"Screenwriting\",\n    \"Urban Planning\",\n    \"Gluten-Free Baking\",\n    \"Car Restoration\",\n    \"Astronomy Observations\",\n    \"Mobile App Development\",\n    \"Underwater Diving\",\n    \"Philanthropy\",\n    \"Jungle Safaris\",\n    \"Tea Tasting\",\n    \"Nonprofit Management\",\n    \"Experimental Theater\",\n    \"Digital Marketing\",\n    \"Portrait Painting\",\n    \"Coworking Spaces\",\n    \"Supernatural TV Shows\",\n    \"Outdoor Survival Skills\",\n    \"Puzzle Designing\",\n    \"Archaeological Digs\",\n    \"Youth Mentorship\",\n    \"Artificial Intelligence\",\n    \"Comic Book Collecting\",\n    \"Medieval Battles\",\n    \"Butterfly Gardens\",\n    \"Celebrity Biographies\",\n    \"Eco-friendly Travel\",\n    \"Antique Jewelry\",\n    \"College Football\",\n    \"Traditional Dancing\",\n    \"Feng Shui\",\n    \"Cosplay Events\",\n    \"Forensic Science\",\n    \"Espresso Making\",\n    \"Geopolitical Analysis\",\n    \"Upholstery\",\n    \"Sci-Tech Festivals\",\n    \"Animal Rights Activism\"\n]",
                  "data_type": "json"
                },
                "type": "data"
              }
            ],
            "color": "#E91F1F",
            "id": "UtCWAc0O",
            "name": "cats"
          },
          "id": "UtCWAc0O",
          "position": {
            "x": 642.9011267526239,
            "y": -44.193408450174914
          },
          "type": "flow"
        },
        "main": {
          "data": {
            "blocks": [
              {
                "ai_config": {},
                "id": "output",
                "name": "output",
                "order": 0,
                "prompt": "{text}\n--\n{structure}",
                "settings": {},
                "type": "merge"
              },
              {
                "ai_config": {
                  "model": "meta-llama/llama-3-8b-instruct",
                  "service": "d8f3w0dybvkbay8"
                },
                "id": "5u119vq3",
                "name": "text",
                "order": -2,
                "prompt": "make a random meaningful text in \"{cats.selected}\" topic .\nuse numbers , dates , anything.\nno extra talk or chat:",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "llm"
              },
              {
                "ai_config": {},
                "id": "bICSm5D1",
                "name": "Untitled",
                "order": -3,
                "prompt": "",
                "settings": {
                  "cache": false,
                  "item_seperator": ",",
                  "selected_flow": "UtCWAc0O"
                },
                "type": "run-flow"
              },
              {
                "ai_config": {
                  "model": "openai/gpt-4-turbo",
                  "service": "d8f3w0dybvkbay8"
                },
                "id": "J6pydLGJ",
                "name": "structure",
                "order": -1,
                "prompt": "extract key info's of this provided text , give the response in Sample format (typescript schema , json data).\nimportant rules: \n- do not use nested objects \n- response should be like sample,  no need define new types or js variables , only like sample.\n- second part is json , its start with { .\n- separate parts with -- \n- no need to extract long texts , only key info.\ntext:\n{text}\n\nResponse sample, no extra talk or chat:\ntype Schema={\ntest:string\n}\n--\n{\n  \"test\":\"\"\n}",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "llm"
              }
            ],
            "color": "#3894FF",
            "id": "main",
            "name": "Main Flow"
          },
          "id": "main",
          "position": {
            "x": 76.90329577491252,
            "y": -44.384240519780406
          },
          "type": "flow"
        }
      }
}

```
qa sample flows:
```
{
"flow": {
        "hAf1grn5": {
          "data": {
            "blocks": [
              {
                "ai_config": {
                  "model": "openai/gpt-4-turbo",
                  "service": "d8f3w0dybvkbay8"
                },
                "id": "KaaW5kaZ",
                "name": "data",
                "order": -2,
                "prompt": "generate 20 different categories about any question topic.",
                "settings": {
                  "cache": true,
                  "item_seperator": ",",
                  "response_sample": "[\"math\",...]",
                  "response_schema": "string[]",
                  "response_type": "json"
                },
                "type": "llm"
              },
              {
                "ai_config": {},
                "id": "35Bww8DB",
                "name": "selected",
                "order": -1,
                "prompt": "{rand(data)}",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "merge"
              }
            ],
            "color": "#531FE9",
            "id": "hAf1grn5",
            "name": "categories"
          },
          "id": "hAf1grn5",
          "position": {
            "x": 605.6829651156903,
            "y": 92.13858160310141
          },
          "type": "flow"
        },
        "main": {
          "data": {
            "blocks": [
              {
                "ai_config": {},
                "id": "output",
                "name": "output",
                "order": 0,
                "prompt": "User: {question}\n\nAssistant: {answer}",
                "settings": {},
                "type": "merge"
              },
              {
                "ai_config": {},
                "id": "C2Rz5BM9",
                "name": "Untitled",
                "order": -3,
                "prompt": "",
                "settings": {
                  "cache": false,
                  "item_seperator": ",",
                  "selected_flow": "hAf1grn5"
                },
                "type": "run-flow"
              },
              {
                "ai_config": {
                  "model": "openai/gpt-4-turbo",
                  "service": "d8f3w0dybvkbay8"
                },
                "id": "KWyUqM3M",
                "name": "question",
                "order": -2,
                "prompt": "make a random question in the '{categories.selected}' , no answer or extra talk , add ? at end:",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "llm"
              },
              {
                "ai_config": {
                  "model": "meta-llama/llama-3-70b-instruct",
                  "service": "d8f3w0dybvkbay8"
                },
                "id": "GGzeVTVR",
                "name": "answer",
                "order": -1,
                "prompt": "answer this question, short answer:\n{question}",
                "settings": {
                  "cache": false,
                  "item_seperator": ","
                },
                "type": "llm"
              }
            ],
            "color": "#3894FF",
            "id": "main",
            "name": "Main Flow"
          },
          "id": "main",
          "position": {
            "x": 101.091290948601,
            "y": 101.09129094860111
          },
          "type": "flow"
        }
      }
}
```

