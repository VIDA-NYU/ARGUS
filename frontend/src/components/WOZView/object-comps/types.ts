interface RecipeObject {
    label: string,
    type: "ingredient"| "tool",
}

interface RecipeObjectStatus {
    object: RecipeObject
    detected: boolean,
    num: number
}

interface RecipeObjectIndex {
    ingredients: Array<RecipeObject>,
    tools: Array<RecipeObject>
}

interface RecipeObjectStatusIndex {
    ingredients: Array<RecipeObjectStatus>,
    tools: Array<RecipeObjectStatus>
}


export type {RecipeObject, RecipeObjectStatus, RecipeObjectIndex, RecipeObjectStatusIndex}