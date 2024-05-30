import React, { useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Textarea from "../components/Textarea";
import NavBar from "../components/NavBar";
import RecipeElement from "../components/RecipeElement";
import AddElement from "../assets/add-icon.png";

function ElementsModal(p) {
  const setShowModal = p.setShowModal;
  const addElement = p.addElement;

  return (
    <div
      className="flex justify-center items-center fixed inset-0 text-zinc-100 bg-zinc-950 bg-opacity-80"
      onMouseDownCapture={(event) => {
        const isOutsideModal = !event.target.closest(".model-inner");

        if (isOutsideModal) {
          setShowModal(false);
        }
      }}
    >
      <div className="flex flex-col w-5/12 max-w-lg h-[50%] max-h-lg aspect-1 gap-6 p-6 rounded-3xl bg-zinc-900 model-inner">
        <div className="flex justify-end">
          <button
            className="p-3 rounded-3xl hover:bg-zinc-500"
            onClick={() => {
              setShowModal(false);
            }}
          >
            X
          </button>
        </div>
        <p className="text-3xl font-semibold text-center">Add to Recipe</p>
        <ul className="flex flex-col gap-3 h-full overflow-y-scroll overflow-x-hidden scrollable-div">
          <li>
            <button
              className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500"
              onClick={() => {
                addElement("Text");
              }}
            >
              Text
            </button>
          </li>
          <li>
            <button
              className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500"
              onClick={() => {
                addElement("Subheading");
              }}
            >
              Subheading
            </button>
          </li>
          <li>
            <button
              className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500"
              onClick={() => {
                addElement("Images");
              }}
            >
              Images
            </button>
          </li>
          <li>
            <button
              className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500"
              onClick={() => {
                addElement("Image and Text");
              }}
            >
              Image and Text
            </button>
          </li>
          <li>
            <button
              className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500"
              onClick={() => {
                addElement("Video");
              }}
            >
              Video
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function RecipeBuilder(p) {
  const currentTab = p.currentTab;
  const setCurrentTab = p.setCurrentTab;
  const user = p.user;

  const [showModal, setShowModal] = useState(false);
  const [recipeImage, setRecipeImage] = useState(new Blob());
  const [summary, setSummary] = useState("");
  const [ingredients, setIngredients] = useState([{ key: uuidv4() }]);
  const [title, setTitle] = useState("");
  const [elementTexts, setElementTexts] = useState([]);
  const [elementFiles, setElementFiles] = useState([]);
  const [recipeElements, setRecipeElements] = useState([]);

  useLayoutEffect(() => {
    setCurrentTab("Builder");
  }, []);

  useLayoutEffect(() => {
    console.log("text");
    console.log(elementTexts);
    console.log("file");
    console.log(elementFiles);
    console.log("elements");
    console.log(recipeElements);
  }, [elementTexts, elementFiles, recipeElements]);

  function addElement(contentType) {
    const keyIndex = uuidv4();

    setShowModal(false);
    setElementTexts([...elementTexts, { key: keyIndex, value: "" }]);
    setElementFiles([...elementFiles, { key: keyIndex, value: [""] }]);
    setRecipeElements([
      ...recipeElements,
      { key: keyIndex, value: { contentType, text: "", files: [] } },
    ]);
  }

  function publishRecipe() {
    console.log({
      userId: p.user.userId,
      categories: [],
      tags: [],
      recipeImage,
      title,
      summary,
      ingredients,
      recipeElements,
    });

    const formData = new FormData();
    formData.append("userId", p.user.userId);
    formData.append("categories", []);
    formData.append("tags", []);
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append(
      "ingredients",
      JSON.stringify(
        ingredients
          .filter((ingredient) => ingredient.value !== "")
          .map((ingredient) => ingredient.value)
      )
    );
    formData.append("recipeImage", recipeImage);
    formData.append(
      "recipeElements",
      JSON.stringify(
        recipeElements.map((element, objectIndex) => {
          const contentType = recipeElements.find(
            (elementContent) => elementContent.key === element.key
          ).value.contentType;
          const text = elementTexts.find(
            (elementContent) => elementContent.key === element.key
          ).value;
          const preFiles = elementFiles.find(
            (elementContent) => elementContent.key === element.key
          ).value;

          console.log("element files");
          console.log(preFiles);
          if (preFiles) {
            preFiles.forEach((file, arrayIndex) => {
              formData.append(`files-${objectIndex}-${arrayIndex}`, file);
            });
          }
          console.log(preFiles.length);
          console.log("yes");
          return {
            contentType,
            text,
            filesLength: preFiles.length - 1,
            files: [],
          };
        })
      )
    );
    console.log(formData.get("recipeElements"));
    axios
      .post(`http://localhost:8080/publish-recipe`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Status Code:", response.status);
        console.log("Data:", response.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Error Status:", err.response.status);
          console.log("Error Data:", err.response.data);
        } else if (err.request) {
          console.log("Error Request:", err.request);
        } else {
          console.log("Error Message:", err.message);
        }
      });
  }

  return (
    <div>
      <NavBar
        ingredients={ingredients}
        setIngredients={setIngredients}
        recipeImage={recipeImage}
        setRecipeImage={setRecipeImage}
        summary={summary}
        setSummary={setSummary}
        publishRecipe={publishRecipe}
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <div className="pr-0 flex flex-col gap-3 p-3 h-svh overflow-y-scroll scrollable-div bg-zinc-950">
        <div
          className="grid w-full gap-3"
          style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
        >
          <div className="col-span-4"></div>
          <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
            <p className="text-2xl font-bold h-16 mb-3 p-6 flex items-center text-zinc-400">
              What are you cooking?
            </p>
            <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
              <Textarea
                attribute={`${
                  !title && "bg-zinc-700"
                } px-3 text-3xl font-bold w-full text-center focus:bg-zinc-700 bg-transparent`}
                maxLength={200}
                value={title}
                setValue={setTitle}
                placeholder="What is the title of your recipe?"
              />
            </div>
            {recipeElements &&
              recipeElements.map((element) => (
                <RecipeElement
                  key={element.key}
                  keyIndex={element.key}
                  contentType={element.value.contentType}
                  addElement={addElement}
                  elementTexts={elementTexts}
                  setElementTexts={setElementTexts}
                  elementFiles={elementFiles}
                  setElementFiles={setElementFiles}
                  recipeElements={recipeElements}
                  setRecipeElements={setRecipeElements}
                />
              ))}
            <button
              className="flex items-center w-full mb-3 p-6 rounded-3xl bg-orange-500 hover:bg-orange-400"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <div className="flex w-full justify-center">
                <img className="w-8" src={AddElement} alt="" />
              </div>
            </button>
          </div>
        </div>
        {showModal && (
          <ElementsModal setShowModal={setShowModal} addElement={addElement} />
        )}
      </div>
    </div>
  );
}

export default RecipeBuilder;
