class API {
  constructor() {
    this.baseUrl = "http://localhost:3001";
    this.recipeEnd = "/recipes";
    this.specialEnd = "/specials";
    this.options = { headers: { "Content-Type": "application/json" } };
  }

  patchRecipe = (formData, id) => {
    fetch(`${this.baseUrl}${this.recipeEnd}/${id}`, {
      ...this.options,
      method: "PATCH",
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status === 201) {
        location.reload();
      }
    });
  };

  postRecipe = (formData) => {
    fetch(`${this.baseUrl}${this.recipeEnd}`, {
      ...this.options,
      method: "POST",
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status === 201) {
        location.reload();
      }
    });
  };

  postSpecial = (formData) => {
    fetch(`${this.baseUrl}${this.specialEnd}`, {
      ...this.options,
      method: "POST",
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status === 201) {
        location.reload();
      }
    });
  };

  fetchRecipeList = async () => {
    const res = await fetch(`${this.baseUrl}${this.recipeEnd}`);

    if (res.status === 200) {
      const data = await res.json();

      return data;
    }

    return { error: "something went wrong please refresh page" };
  };

  fetchSingleRecipe = async (id) => {
    const res = await fetch(`${this.baseUrl}${this.recipeEnd}/${id}`);

    if (res.status === 200) {
      const data = await res.json();

      return data;
    }

    return { error: "something went wrong please refresh page" };
  };

  fetchSpecial = async (id) => {
    const res = await fetch(
      `${this.baseUrl}${this.specialEnd}?ingredientId=${id}`
    );

    if (res.status === 200) {
      const data = await res.json();

      return data;
    }

    return { error: "something went wrong please refresh page" };
  };
}

class Recipes extends API {
  constructor() {
    super();
    this.mainPart = document.getElementById("mainPart");
    this.recipes = [];
    this.addRecipeForm = document.getElementById("addRecipeForm");
    this.editRecipeForm = document.getElementById("editRecipeForm");
    this.ingredientsInputContainer = document.querySelector(
      ".ingredientsContainer"
    );
    this.directionInputContainer = document.querySelector(
      ".directionsContainer"
    );
    this.addSpecialForm = document.getElementById("addSpecialForm");

    this.fieldDefaultStyle =
      "py-2 px-4 mb-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md";
  }

  addingredientFields = (ingredientsInputContainer, inputContainer) => {
    const div = this.createAElem("div", {
      className: `${inputContainer} mt-2`,
    });
    const amount = this.createAElem("input", {
      className: this.fieldDefaultStyle,
    });
    const measurement = this.createAElem("input", {
      className: this.fieldDefaultStyle,
    });
    const name = this.createAElem("input", {
      className: this.fieldDefaultStyle,
    });

    name.setAttribute("name", "name");
    name.setAttribute("type", "text");
    name.setAttribute("placeholder", "name");

    measurement.setAttribute("name", "measurement");
    measurement.setAttribute("type", "text");
    measurement.setAttribute("placeholder", "measurement");

    amount.setAttribute("name", "amount");
    amount.setAttribute("type", "number");
    amount.setAttribute("placeholder", "amount");

    div.append(amount, measurement, name);

    ingredientsInputContainer.append(div);
    // this.ingredientsInputContainer.append(div);
  };

  addingDirectionFields = (directInputContainer, inputContainer) => {
    const div = this.createAElem("div", {
      className: `${inputContainer} mt-2`,
    });
    const instruction = this.createAElem("input", {
      className: this.fieldDefaultStyle,
    });

    instruction.setAttribute("name", "instruction");
    instruction.setAttribute("type", "text");
    instruction.setAttribute("placeholder", "instruction");

    div.append(instruction);

    directInputContainer.append(div);
  };

  createAElem = (tag, options) => {
    const elem = document.createElement(tag);

    if (options !== undefined) {
      if (options.id !== undefined) elem.setAttribute("id", options.id);

      if (options.className !== undefined)
        elem.setAttribute("class", options.className);

      if (options.dataAttrib !== undefined)
        elem.setAttribute("data-uuid", options.dataAttrib);

      if (options.input !== undefined) {
        elem.setAttribute("name", options.input.name);
        elem.setAttribute("type", options.input.type);
        elem.setAttribute("placeholder", options.input.placeholder);
        elem.setAttribute("value", options.input.value);
      }
    }
    return elem;
  };

  getRecipeList = async () => {
    this.mainPart.innerHTML = "";
    const list = await this.fetchRecipeList();

    if (list) {
      this.recipes = list;

      this.loadIngredients(list);

      const listContainer = this.createAElem("div", {
        className:
          "theList grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3",
      });

      list.forEach((item, i) => {
        const recipeContainer = this.createAElem("div", {
          className:
            "recipe rounded-xl overflow-hidden bg-white shadow-lg cursor-pointer",
          dataAttrib: item.uuid,
        });

        const imageContainer = this.createAElem("div");
        const detailsContainer = this.createAElem("div", {
          className: "m-3",
        });
        const image = this.createAElem("img", {
          className: "object-cover h-48 w-full",
        });
        const title = this.createAElem("p", {
          className:
            "font-bold text-md text-green-600 overflow-ellipsis overflow-x-hidden whitespace-nowrap",
        });
        const description = this.createAElem("p", {
          className:
            "text-sm mt-1 text-gray-600 overflow-ellipsis overflow-x-hidden whitespace-nowrap",
        });

        image.src = `./${item.images.medium}`;
        imageContainer.append(image);

        title.innerText = item.title;
        description.innerText = item.description;

        detailsContainer.append(title, description);
        recipeContainer.append(imageContainer, detailsContainer);

        recipeContainer.addEventListener("click", () =>
          this.viewSingleRecipe(item.uuid, i)
        );

        listContainer.append(recipeContainer);
      });

      this.mainPart.append(listContainer);
    }
  };

  viewSingleRecipe = async (id, i) => {
    const recipe = await this.fetchSingleRecipe(id);

    if (recipe) {
      this.mainPart.innerHTML = "";
      const recipeContainer = await this.createAElem("div");
      const imageContainer = this.createAElem("div", { className: "mb-5" });
      const upperDetailsContainer = this.createAElem("div", {
        className: "mb-12",
      });
      const lowerDetailsContainer = this.createAElem("div", {
        className: "mb-12",
      });
      const ingredientsContainer = this.createAElem("div", {
        className: "mb-12",
      });
      const instructionsContainer = this.createAElem("div", {
        className: "mb-12",
      });
      const ulIngridients = this.createAElem("ul", { className: "pl-2" });
      const ulInstructions = this.createAElem("ul", { className: "pl-2" });
      const ingredientsHeader = this.createAElem("h5", {
        className: "text-sm font-semibold text-green-600 mb-2",
      });
      const instructionsHeader = this.createAElem("h5", {
        className: "text-sm font-semibold text-green-600 mb-2",
      });

      const image = this.createAElem("img", {
        className: "object-cover h-80 w-full rounded-md",
      });
      const title = this.createAElem("p", {
        className:
          "font-bold text-lg text-green-600 overflow-ellipsis overflow-x-hidden whitespace-nowrap mb-2",
      });
      const description = this.createAElem("p", {
        className:
          "text-sm mt-1 text-gray-600 overflow-ellipsis overflow-x-hidden whitespace-nowrap",
      });

      const editBtn = this.createAElem("button", {
        id: "editRecipeBtn",
        className:
          "font-bold text-xs mb-4 text-blue-700 rounded-md px-2 py-1 bg-gray-300 lowercase hover:text-blue-800",
      });

      const divBaseStyles = "inline-block py-1";
      const dataBaseStyles =
        "font-bold text-3xl text-green-600 block text-center";
      const labelBaseStyles =
        "block text-center font-semibold uppercase text-xs text-green-600";

      const servings = this.createAElem("div", {
        className: `${divBaseStyles} pr-4`,
      });
      const servingsData = this.createAElem("span", {
        className: dataBaseStyles,
      });
      const servingsLabel = this.createAElem("span", {
        className: labelBaseStyles,
      });
      const prepTime = this.createAElem("div", {
        className: `${divBaseStyles} px-4 border-r-2 border-l-2 border-gray-300`,
      });
      const prepTimeData = this.createAElem("span", {
        className: dataBaseStyles,
      });
      const prepTimeLabel = this.createAElem("span", {
        className: labelBaseStyles,
      });
      const cookTime = this.createAElem("div", {
        className: `${divBaseStyles} pl-4`,
      });
      const cookTimeData = this.createAElem("span", {
        className: dataBaseStyles,
      });
      const cookTimeLabel = this.createAElem("span", {
        className: labelBaseStyles,
      });

      await Promise.all(
        recipe.ingredients.map(async (item) => {
          const special = await this.fetchSpecial(item.uuid);
          const li = this.createAElem("li", { className: "mb-3" });
          const span = this.createAElem("span", {
            className: `text-sm text-gray-700 block ${
              special.length > 0 ? "mb-2" : "mb-0"
            }`,
          });

          span.innerText = `- ${item.name}`;

          if (special.length > 0) {
            const specialContainer = this.createAElem("div", {
              className: "p-4 ml-3 bg-blue-100 rounded-lg inline-block",
            });
            const title = this.createAElem("p", { className: "text-sm mb-1" });
            const type = this.createAElem("p", {
              className: "text-base font-bold mb-2 uppercase",
            });
            const text = this.createAElem("p", { className: "text-sm" });

            title.innerText = special[0].title;
            type.innerText = `${special[0].type}!`;
            text.innerText = special[0].text;

            specialContainer.append(type, title, text);

            li.append(specialContainer);
          }
          li.prepend(span);
          ulIngridients.append(li);
        })
      );

      recipe.directions.forEach((item, i) => {
        const li = this.createAElem("li", {
          className: "mb-3 text-sm text-gray-700 block",
        });

        li.innerText = `${i + 1}. ${item.instructions}`;

        ulInstructions.append(li);
      });

      image.src = `./${recipe.images.full}`;
      imageContainer.append(image);

      title.innerText = recipe.title;
      description.innerText = recipe.description;
      editBtn.innerText = "edit recipe";
      editBtn.setAttribute("type", "button");
      upperDetailsContainer.append(editBtn, title, description);

      servingsData.innerText = recipe.servings;
      servingsLabel.innerText = recipe.servings > 1 ? "servings" : "serving";
      prepTimeData.innerText = recipe.prepTime;
      prepTimeLabel.innerText = "Prep time";
      cookTimeData.innerText = recipe.cookTime;
      cookTimeLabel.innerText = "cook time";

      servings.append(servingsData, servingsLabel);
      prepTime.append(prepTimeData, prepTimeLabel);
      cookTime.append(cookTimeData, cookTimeLabel);

      lowerDetailsContainer.append(servings, prepTime, cookTime);

      ingredientsHeader.innerText = "Ingredients";
      instructionsHeader.innerText = "Instructions";
      ingredientsContainer.append(ingredientsHeader, ulIngridients);
      instructionsContainer.append(instructionsHeader, ulInstructions);

      recipeContainer.append(
        imageContainer,
        upperDetailsContainer,
        lowerDetailsContainer,
        ingredientsContainer,
        instructionsContainer
      );

      this.mainPart.append(recipeContainer);
      editBtn.addEventListener("click", () => this.showEditForm(recipe));
    }
  };

  showEditForm = (recipe) => {
    const editRecipeContainer = document.getElementById("editRecipeContainer");
    this.mainPart.classList.add("hidden");
    editRecipeContainer.classList.remove("hidden");
    editRecipeContainer.classList.add("block");

    const title = this.createAElem("input", {
      className: this.fieldDefaultStyle,
      input: {
        name: "title",
        type: "text",
        placeholder: "title",
        value: recipe.title,
      },
    });

    const description = this.createAElem("input", {
      className: this.fieldDefaultStyle,
      input: {
        name: "description",
        type: "text",
        placeholder: "description",
        value: recipe.description,
      },
    });

    const servings = this.createAElem("input", {
      className: this.fieldDefaultStyle,
      input: {
        name: "servings",
        type: "number",
        placeholder: "servings",
        value: recipe.servings,
      },
    });

    const prepTime = this.createAElem("input", {
      className: this.fieldDefaultStyle,
      input: {
        name: "prepTime",
        type: "number",
        placeholder: "prepTime",
        value: recipe.prepTime,
      },
    });

    const cookTime = this.createAElem("input", {
      className: this.fieldDefaultStyle,
      input: {
        name: "cookTime",
        type: "number",
        placeholder: "cookTime",
        value: recipe.cookTime,
      },
    });

    const editIngredientsContainer = this.createAElem("div", {
      className: "editIngredientsContainer",
    });

    const ingredientsHeader = this.createAElem("div", {
      className: "flex flex-row flex-wrap place-content-between mt-5 mb-1",
    });

    const ingHeader = this.createAElem("p", { className: "text-sm" });
    ingHeader.innerHTML = "Ingredients:";
    const addIngredient = this.createAElem("button", {
      id: "addIngFields",
      className:
        "font-bold text-xs text-blue-700 lowercase hover:text-blue-800",
    });
    addIngredient.innerText = "+ add ingredient";
    addIngredient.setAttribute("type", "button");
    addIngredient.addEventListener("click", () =>
      this.addingredientFields(editIngredientsContainer, "editIngredientInput")
    );

    ingredientsHeader.append(ingHeader, addIngredient);
    editIngredientsContainer.append(ingredientsHeader);

    recipe.ingredients.forEach((ing) => {
      const div = this.createAElem("div", {
        className: "editIngredientInput mt-2",
      });
      const amount = this.createAElem("input", {
        className: this.fieldDefaultStyle,
        input: {
          name: "amount",
          type: "number",
          placeholder: "amount",
          value: ing.amount,
        },
      });

      const measurement = this.createAElem("input", {
        className: this.fieldDefaultStyle,
        input: {
          name: "measurement",
          type: "text",
          placeholder: "measurement",
          value: ing.measurement,
        },
      });

      const name = this.createAElem("input", {
        className: this.fieldDefaultStyle,
        input: {
          name: "name",
          type: "text",
          placeholder: "name",
          value: ing.name,
        },
      });

      div.append(amount, measurement, name);

      editIngredientsContainer.append(div);
    });

    const editDirectionsContainer = this.createAElem("div", {
      className: "editDirectionsContainer",
    });

    const directionsHeader = this.createAElem("div", {
      className: "flex flex-row flex-wrap place-content-between mt-5 mb-1",
    });

    const dirHeader = this.createAElem("p", { className: "text-sm" });
    dirHeader.innerHTML = "Instructions:";
    const addDirection = this.createAElem("button", {
      id: "addDirFields",
      className:
        "font-bold text-xs text-blue-700 lowercase hover:text-blue-800",
    });
    addDirection.innerText = "+ add direction";
    addDirection.setAttribute("type", "button");
    addDirection.addEventListener("click", () =>
      this.addingDirectionFields(editDirectionsContainer, "editDirectionInput")
    );

    directionsHeader.append(dirHeader, addDirection);
    editDirectionsContainer.append(directionsHeader);

    recipe.directions.forEach((dir) => {
      const div = this.createAElem("div", {
        className: "editDirectionInput mt-2",
      });

      const instruction = this.createAElem("input", {
        className: this.fieldDefaultStyle,
        input: {
          name: "instruction",
          type: "text",
          placeholder: "instruction",
          value: dir.instructions,
        },
      });

      div.append(instruction);

      editDirectionsContainer.append(div);
    });

    const saveBtn = this.createAElem("button", {
      className:
        "py-2 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    });

    saveBtn.setAttribute("type", "submit");
    saveBtn.innerText = "update recipe";

    editRecipeContainer.children[0].append(
      title,
      description,
      servings,
      prepTime,
      cookTime,
      editIngredientsContainer,
      editDirectionsContainer,
      saveBtn
    );

    this.editRecipe(recipe);
  };

  addRecipe = () => {
    this.addRecipeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formData = {
        postDate: new Date(),
        editDate: undefined,
        images: { full: null, medium: null, small: null },
      };

      const arrRecipeFormChildren = [...this.addRecipeForm.children];

      arrRecipeFormChildren.forEach((item) => {
        if (
          !item.classList.contains("ingredientsContainer") ||
          !item.classList.contains("directionsContainer")
        ) {
          const name = item.getAttribute("name");
          const value = item.value;

          formData = { ...formData, [name]: value };
        }

        if (!item.classList.contains("ingredientsContainer")) {
          const ingreInput = document.querySelectorAll(".ingredientInput");

          const arrIngreInput = [...ingreInput];

          const ingredients = arrIngreInput.map((ingre) => {
            const uuid = Math.floor(Math.random() * 9000000000) + 1000000000;

            return {
              amount: ingre.children[0].value,
              measurement: ingre.children[1].value,
              name: ingre.children[2].value,
              uuid,
            };
          });

          formData = { ...formData, ingredients };
        }

        if (!item.classList.contains("directionsContainer")) {
          const dirInput = document.querySelectorAll(".directionInput");

          const arrDirInput = [...dirInput];

          const directions = arrDirInput.map((direct) => ({
            instructions: direct.children[0].value,
            optional: false,
          }));

          formData = { ...formData, directions };
        }
      });

      this.postRecipe(formData);

      return false;
    });
  };

  editRecipe = (recipe) => {
    this.editRecipeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const { images, postDate, uuid } = recipe;

      let formData = {
        postDate,
        editDate: new Date(),
        images,
      };

      const arrRecipeFormChildren = [...e.currentTarget.children];

      arrRecipeFormChildren.forEach((item) => {
        if (
          !item.classList.contains("editIngredientsContainer") ||
          !item.classList.contains("editDirectionsContainer")
        ) {
          const name = item.getAttribute("name");
          const value = item.value;

          formData = { ...formData, [name]: value };
        }

        if (!item.classList.contains("editIngredientsContainer")) {
          const ingreInput = document.querySelectorAll(".editIngredientInput");

          const arrIngreInput = [...ingreInput];

          const ingredients = arrIngreInput.map((ingre) => {
            const uuid = Math.floor(Math.random() * 9000000000) + 1000000000;

            return {
              amount: ingre.children[0].value,
              measurement: ingre.children[1].value,
              name: ingre.children[2].value,
              uuid,
            };
          });

          formData = { ...formData, ingredients };
        }

        if (!item.classList.contains("editDirectionsContainer")) {
          const dirInput = document.querySelectorAll(".editDirectionInput");

          const arrDirInput = [...dirInput];

          const directions = arrDirInput.map((direct) => ({
            instructions: direct.children[0].value,
            optional: false,
          }));

          formData = { ...formData, directions };
        }
      });

      this.patchRecipe(formData, uuid);

      return false;
    });
  };

  addSpecial = () => {
    this.addSpecialForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formData = {
        geo: undefined,
      };

      const arrSpecialFormChildren = [...e.currentTarget.children];

      arrSpecialFormChildren.forEach((item) => {
        if (item.tagName !== "BUTTON")
          formData = { ...formData, [item.name]: item.value };
      });

      this.postSpecial(formData);

      return false;
    });
  };

  loadIngredients = (recipes) => {
    let combinedIngredients = [];
    const ingSelectInput = document.getElementById("ingSelectInput");

    recipes.forEach(
      (recipe) =>
        (combinedIngredients = [...combinedIngredients, ...recipe.ingredients])
    );

    const filteredIngredients = Array.from(
      new Set(combinedIngredients.map((ing) => ing.name))
    ).map((name) => combinedIngredients.find((ing) => ing.name === name));

    filteredIngredients.forEach((ing) => {
      const option = this.createAElem("option", {
        className: "sm:text-sm text-gray-400",
      });
      option.setAttribute("value", ing.uuid);
      option.innerText = ing.name;

      ingSelectInput.append(option);
    });
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const recipes = new Recipes();

  recipes.getRecipeList();
  recipes.addRecipe();
  recipes.addSpecial();

  document
    .getElementById("addIngFields")
    .addEventListener("click", () =>
      recipes.addingredientFields(
        recipes.ingredientsInputContainer,
        "ingredientInput"
      )
    );

  document
    .getElementById("addDirFields")
    .addEventListener("click", () =>
      recipes.addingDirectionFields(
        recipes.directionInputContainer,
        "directionInput"
      )
    );

  document.getElementById("recipeListMenu").addEventListener("click", () => {
    const mainPart = document.getElementById("mainPart");
    const addRecipeContainer = document.getElementById("addRecipeContainer");
    const addSpecialContainer = document.getElementById("addSpecialContainer");
    const editRecipeContainer = document.getElementById("editRecipeContainer");

    if (recipes.editRecipeForm.children.length > 0) {
      while (recipes.editRecipeForm.firstChild) {
        recipes.editRecipeForm.removeChild(recipes.editRecipeForm.lastChild);
      }
    }

    if (mainPart.classList.contains("hidden")) {
      recipes.getRecipeList();
      addRecipeContainer.classList.add("hidden");
      addSpecialContainer.classList.add("hidden");
      editRecipeContainer.classList.add("hidden");
      mainPart.classList.remove("hidden");
      mainPart.classList.add("block");
    } else {
      if (!this.mainPart.children[0].classList.contains("theList")) {
        recipes.getRecipeList();
      }
      return;
    }
  });

  document.getElementById("addRecipeMenu").addEventListener("click", () => {
    const mainPart = document.getElementById("mainPart");
    const addRecipeContainer = document.getElementById("addRecipeContainer");
    const addSpecialContainer = document.getElementById("addSpecialContainer");

    if (recipes.editRecipeForm.children.length > 0) {
      while (recipes.editRecipeForm.firstChild) {
        recipes.editRecipeForm.removeChild(recipes.editRecipeForm.lastChild);
      }
    }

    if (addRecipeContainer.classList.contains("hidden")) {
      mainPart.classList.add("hidden");
      addSpecialContainer.classList.add("hidden");
      editRecipeContainer.classList.add("hidden");
      addRecipeContainer.classList.remove("hidden");
      addRecipeContainer.classList.add("block");
    } else {
      return;
    }
  });

  document.getElementById("addSpecialMenu").addEventListener("click", () => {
    const mainPart = document.getElementById("mainPart");
    const addRecipeContainer = document.getElementById("addRecipeContainer");
    const addSpecialContainer = document.getElementById("addSpecialContainer");

    if (recipes.editRecipeForm.children.length > 0) {
      while (recipes.editRecipeForm.firstChild) {
        recipes.editRecipeForm.removeChild(recipes.editRecipeForm.lastChild);
      }
    }

    if (addSpecialContainer.classList.contains("hidden")) {
      mainPart.classList.add("hidden");
      addRecipeContainer.classList.add("hidden");
      editRecipeContainer.classList.add("hidden");
      addSpecialContainer.classList.remove("hidden");
      addSpecialContainer.classList.add("block");
    } else {
      return;
    }
  });
});
