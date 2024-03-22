"use client";

import React, { useEffect, useState, useCallback, createRef } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import { FixedSizeList as List, FixedSizeList } from "react-window";
import { useDebouncedCallback } from "use-debounce";

import { globalStyles } from "styles";
import style from "./chat.module.css";

import PageRenderer from "./PageRenderer";
import { PDF, Chunk } from "interfaces";
import { useTheme } from "@mui/material/styles";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface MyComponentProps {
	pdf: PDF | null;
	highlightedChunks: Chunk[];
	currentPage: string;
	setCurrentPage: (page: string) => void;
	listRef: React.RefObject<FixedSizeList>;
}

const bodyHeightPercentage =
	1 - parseInt(globalStyles.headerHeight.slice(0, -2)) / 100;

function highlightPattern(text: string, patterns: string[]) {
	for (var i = 0; i < patterns.length; i++) {
		text = text.replace(
			patterns[i],
			(value) =>
				`<mark style="background-color: #D8E7F8;">${value}</mark>`
		);
	}
	return text;
}

const PDFViewer: React.FC<MyComponentProps> = ({
	pdf,
	highlightedChunks,
	currentPage,
	setCurrentPage,
	listRef,
}) => {
	const theme = useTheme();
	const listStyles =
		theme.palette.mode === "dark" ? style.darkList : style.lightList;

	const [pdfHeight, setPdfHeight] = useState<number>(
		typeof window !== "undefined"
			? window.innerHeight * bodyHeightPercentage
			: 640
	);

	useEffect(() => {
		function updateWidth() {
			setPdfHeight(window.innerHeight * bodyHeightPercentage);
		}
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	const debouncedScroll = useDebouncedCallback((visibleStopIndex) => {
		setCurrentPage((visibleStopIndex + 1).toString());
	}, 20);

	const handleInputPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const pageNumber: string = event.target.value;
		if (pageNumber == "") {
			setCurrentPage(pageNumber);
		} else if (
			/^(?:[1-9]\d*)?$/.test(pageNumber) &&
			parseInt(pageNumber) < pdf?.num_pages! + 1
		) {
			setCurrentPage(pageNumber);
			listRef.current?.scrollToItem(
				parseInt(pageNumber == "" ? "0" : pageNumber) - 1,
				"start"
			);
		}
	};

	const textRenderer = useCallback(
		(textItem: { str: string }) => {
			const patterns = highlightedChunks
				.filter((o) => o.pageNum == parseInt(currentPage))
				.map((o) => o.text);
			return highlightPattern(textItem.str, patterns);
		},
		[currentPage]
	);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				// backgroundColor: "lightblue",
				width: "45%",
				justifyContent: "space-between",
				// borderRight: 1,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					height: globalStyles.headerHeight,
				}}
			>
				<Typography sx={{ m: 2 }}>{pdf?.pdf_document_name}</Typography>
				<TextField
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "60px",
						height: "40px",
						border: 1,
						borderColor: theme.palette.text.primary,
						// borderRadius: 2,
						"& fieldset": { border: "none" },
					}}
					value={currentPage.toString()}
					onChange={handleInputPage}
				/>
				<Typography sx={{ m: 2 }}>/{pdf?.num_pages}</Typography>
			</Box>
			<Box
				sx={{
					background: theme.palette.primary.light,
					// background: "pink",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					height: `calc(100vh - ${globalStyles.headerHeight})`,
					overflow: "clip",
				}}
			>
				<Document className={style.document} file={pdf?.filepath}>
					<List
						className={listStyles}
						itemData={{ pdfHeight, textRenderer }}
						ref={listRef}
						height={pdfHeight}
						itemCount={pdf?.num_pages!}
						itemSize={pdfHeight * 1.05}
						width={pdfHeight * 0.801}
						onItemsRendered={({ visibleStopIndex }) =>
							debouncedScroll(visibleStopIndex)
						}
					>
						{PageRenderer}
					</List>
				</Document>
			</Box>
		</Box>
	);
};

export default PDFViewer;