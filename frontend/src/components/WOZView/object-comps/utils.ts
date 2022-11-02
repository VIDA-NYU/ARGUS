import {RecipeObject, RecipeObjectIndex, RecipeObjectStatus, RecipeObjectStatusIndex} from "./types";

function generateRecipeObjectIndex(recipe: any): RecipeObjectIndex{

    let ingredientObjectList: Array<RecipeObject> = [];
    let toolObjectList: Array<RecipeObject> = [];

    let ingredientLabels = recipe.objects.filter(d => !recipe.tools.includes(d))
    for(let ingredientLabel of ingredientLabels){
        ingredientObjectList.push({
            type: "ingredient",
            label: ingredientLabel,
        })
    }

    for(let toolLabel of recipe.tools){
        toolObjectList.push({
            type: "tool",
            label: toolLabel
        })
    };

    return {
        ingredients: ingredientObjectList,
        tools: toolObjectList
    }
}


function getRecipeObjectStatus(recipeObject: RecipeObject, detectedLabels: Array<string>): RecipeObjectStatus{
    let num = 0;
    for(let label of detectedLabels){
        if(label === recipeObject.label){
            num ++;
        }
    }
    return {
        object: recipeObject,
        detected: num > 0,
        num: num
    }
}

function generateRecipeObjectStatusIndex (recipeObjectIndex: RecipeObjectIndex, detectedLabels: Array<string>): RecipeObjectStatusIndex{

    return {
        ingredients: recipeObjectIndex.ingredients.map(d => getRecipeObjectStatus(d, detectedLabels)),
        tools: recipeObjectIndex.tools.map(d => getRecipeObjectStatus(d, detectedLabels))
    };

}

function isCharNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function isStrNumeric(str: string){
    const specialCharacters = ["/", "⁄", "."]
    for(let character of str.split("")){
        if(specialCharacters.includes(character) || isCharNumeric(character)){

        }else{
            return false
        }
    }
    return true
}

function isNumberWithUnit(word: string){
    let subWords = word.split("-");
    if(subWords.length === 1){
        return false;
    }else if(isStrNumeric(subWords[0])){
        return true
    }else{
        return false
    }
}

function getAbbrWord(originalWord: string, isEnd: boolean){
    if(isStrNumeric(originalWord)){
        return originalWord
    }else if(isNumberWithUnit(originalWord)){
        return originalWord
    }
    else if(isEnd){
        return originalWord
    }else{
        return originalWord.slice(0, 1) + "."
    }
}

function getAbbrLabel(recipeObject: RecipeObject){
    let words = recipeObject.label.split(" ")
    let abbrWords = words.map((d, i) => getAbbrWord(d, i === words.length - 1));
    let abbrLabel = abbrWords.join(" ");
    return abbrLabel
}

export {generateRecipeObjectIndex, generateRecipeObjectStatusIndex, getAbbrLabel}