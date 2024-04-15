interface Pricing {
    prompt: string;
    completion: string;
    image: string;
    request: string;
}

interface Architecture {
    modality: string;
    tokenizer: string;
    instruct_type: string | null;
}

interface TopProvider {
    max_completion_tokens: number;
    is_moderated: boolean;
}

interface PerRequestLimits {
    prompt_tokens: string;
    completion_tokens: string;
}

export interface AiModel {
    id: string;
    name: string;
    description: string;
    pricing: Pricing;
    context_length: number;
    architecture: Architecture;
    top_provider: TopProvider;
    per_request_limits: PerRequestLimits;
}