import { useState } from 'react';

import SelectBox from './SelectBox';

function App() {
	async function getBanglaData(text) {
		const url = `
                    https://inputtools.google.com/request?text=${text}&itc=bn-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();

			const point = json[1][0][1];

			return point;
		} catch (error) {
			console.error(error.message);
		}
	}
	const [inputValue, setInputValue] = useState("");
	const [suggestionBoxShown, setSuggestionBoxShown] = useState(false);
	const [suggestedWords, setSuggestedWords] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [splitWordsArray, setSplitWordsArray] = useState([]);

	function inputChangeHandler(e) {
		setInputValue(e.target.value);
		setSuggestionBoxShown(true);
	}

	function convertToBangla(e) {
		let splitArray = inputValue.split(" ");
		splitArray = splitArray.filter((f) => f != false);
		let lastWord = splitArray[splitArray.length - 1];
		let lastIndex = splitArray.length - 1;
		setSplitWordsArray(splitArray);

		if (e.key == " " || e.key == "Enter") {
			// splitArray[lastIndex] = suggestedWords[activeIndex];
			// let mainValue = [...splitArray];
			// mainValue = mainValue.join(" ");
			// setInputValue(mainValue + " ");

			// setSuggestionBoxShown(false);
			// setActiveIndex(0);

			setWord();
		} else if (
			lastWord == "" ||
			e.key == "CapsLock" ||
			e.key == "Tab" ||
			inputValue == ""
		) {
			setSuggestionBoxShown(false);
			return;
		} else if (e.key == "ArrowDown") {
			arrowDown();
		} else {
			getBanglaData(lastWord).then((v) => setSuggestedWords(v));
		}
	}

	function arrowDown() {
		if (activeIndex == suggestedWords.length - 1) {
			setActiveIndex(0);
		} else {
			setActiveIndex((previousIndex) => previousIndex + 1);
		}
	}

	// main function to set word english to bengali
	function setWord() {
		let lastIndex = splitWordsArray.length - 1;

		splitWordsArray[lastIndex] = suggestedWords[activeIndex];
		let mainValue = [...splitWordsArray];
		mainValue = mainValue.join(" ");
		setInputValue(mainValue + " ");

		setSuggestionBoxShown(false);
		setActiveIndex(0);
	}

	return (
		<main className='container py-5'>
			<div className='input-group'>
				<div className='input-wrap'>
					<input
						type='text'
						className='form-control py-3'
						placeholder='Start writing.......'
						value={inputValue}
						onChange={inputChangeHandler}
						onKeyUp={convertToBangla}
					/>
					<div
						className={`list-group mt-1 ${
							suggestionBoxShown ? "d-block" : "d-none"
						}`}
						id='suggestions'
					>
						{suggestedWords &&
							suggestedWords.map((item, index) => (
								<a
									onClick={() => setActiveIndex(index)}
									href={`#${index}`}
									key={item}
									className={`list-group-item list-group-item-action ${
										index == activeIndex && "active"
									}`}
								>
									{item}
								</a>
							))}
					</div>
				</div>
				<SelectBox />
			</div>
		</main>
	);
}

export default App;
