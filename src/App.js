import "./App.css";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { randomColor } from "randomcolor";
import Draggable from "react-draggable";

function App() {
	const hintRef = useRef();
	const [positionChange, setPositionChange] = useState(20);
	const [item, setItem] = useState("");
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem("items")) || []
	);

	useEffect(() => {
		localStorage.setItem("items", JSON.stringify(items));
	}, [items]);

	const createNewItem = () => {
		if (item.trim() !== "") {
			const newItem = {
				id: uuidv4(),
				item,
				color: randomColor({
					luminosity: "light",
				}),
				defaultPos: {
					x: 100,
					y: -500 + positionChange,
				},
			};
			setItems((items) => [...items, newItem]);
			setItem("");
			setPositionChange(positionChange + 20);
		} else {
			alert("Enter something...");
			setItem("");
		}
	};

	const deleteItem = (id) => {
		const newItemsArray = items.filter((item) => item.id !== id);
		setItems(newItemsArray);
	};

	const updatePosition = (data, index) => {
		let newItemsArray = [...items];
		newItemsArray[index].defaultPos = { x: data.x, y: data.y };
		setItems(newItemsArray);
	};

	const handleKeyPress = (e) => {
		if (e.code === "Enter") createNewItem();
	};

	const toggleHint = () => {
		hintRef.current.classList.toggle("showHint");
	};

	return (
		<div className="App">
			<div className="info">
				<button className="info__btn btn" onClick={() => toggleHint()}>
					HOW TO USE
				</button>
				<div className="hint" ref={hintRef}>
					It's simple! Just enter some new task and click 'ENTER' button or
					press 'Enter' on your keyboard. After that you will see your task on
					the left side, you can drag and drop it anywhere you want on the page.{" "}
					<br />
					Have a nice one!
				</div>
			</div>
			<div className="wrapper">
				<input
					value={item}
					type="text"
					placeholder="Enter something"
					onChange={(e) => setItem(e.target.value)}
					onKeyPress={(e) => handleKeyPress(e)}
				/>
				<button className="enter btn" onClick={() => createNewItem()}>
					ENTER
				</button>
			</div>
			{items.map((item, index) => {
				return (
					<Draggable
						key={item.id}
						defaultPosition={item.defaultPos}
						onStop={(_, data) => {
							updatePosition(data, index);
						}}
					>
						<div
							className="todo__item"
							style={{ backgroundColor: item.color }}
							hint="dragme"
						>
							{`${item.item}`}
							<button
								className="delete"
								onClick={() => {
									deleteItem(item.id);
								}}
							>
								X
							</button>
						</div>
					</Draggable>
				);
			})}
		</div>
	);
}

export default App;
