import React, { Dispatch, SetStateAction } from "react";
import { FixedSizeList } from "react-window";

import { Box, Button, ButtonBase, Typography } from "@mui/material";
import { ChatMessage, Chunk } from "interfaces";
import { AccountCircle, CloudCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material";

interface MyComponentProps {
	message: ChatMessage;
	chunks?: Chunk[] | null;
	setHighlightedChunks: (chunks: Chunk[]) => void;
	setCurrentPage: (page: string) => void;
	listRef: React.RefObject<FixedSizeList>;
	setSelectedPDFID: Dispatch<SetStateAction<number | null>>;
}

const Message: React.FC<MyComponentProps> = ({
	message,
	chunks,
	setHighlightedChunks,
	setCurrentPage,
	listRef,
	setSelectedPDFID,
}) => {
	const theme = useTheme();
	const goToPage = (pageNum: number) => {
		setCurrentPage(pageNum.toString());
		listRef.current?.scrollToItem(pageNum - 1, "start");
	};

	const handleOnClick = (chunk: Chunk) => {
		setSelectedPDFID(chunk.pdf_id);
		setTimeout(() => goToPage(chunk.page_num + 1), 250);
		setHighlightedChunks(chunks!);
	};

	if (message.role == "user") {
		// User message
		return (
			<Box
				sx={{
					display: "flex",
					pb: 4,
				}}
			>
				<AccountCircle
					sx={{
						fontSize: 45,
						color: "primary",
						mr: 1,
					}}
				/>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<Typography fontWeight="bold">You</Typography>
					<Typography variant="body2">{message.message}</Typography>
				</Box>
			</Box>
		);
	} else {
		// Bot message
		return (
			<Box sx={{ display: "flex", pb: 4, background: "" }}>
				<CloudCircle sx={{ fontSize: 45, color: "secondary", mr: 1 }} />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
						// background: "pink",
						mr: 3,
					}}
				>
					<Typography fontWeight="bold">DuRAG</Typography>
					<Typography variant="body2">{message.message}</Typography>
					<Box
						sx={{
							background: theme.palette.primary.dark,
							// background: "pink",
							px: 2,
							py: 1,
							mt: 1,
							borderRadius: 1,
							width: "24vw",
							height: "100%",
						}}
					>
						<Typography
							fontWeight="bold"
							sx={{ textDecoration: "underline", mb: 0.5 }}
						>
							Cited sources
						</Typography>
						{/* Uncomment when chunks table settled */}
						{chunks!.map((chunk, index) => {
							return (
								<Box
									key={index}
									sx={{
										display: "flex",
										flexDirection: "column",
										// background: "pink",
										mb: 1,
									}}
								>
									<ButtonBase
										onClick={() => {
											handleOnClick(chunk);
										}}
									>
										<Typography
											sx={{
												// background: "pink",
												textOverflow: "ellipsis",
												overflow: "hidden",
												whiteSpace: "nowrap",
											}}
											variant="body2"
										>
											{index + 1}. {chunk.text}
										</Typography>
									</ButtonBase>
									<Typography
										variant="caption"
										sx={{ ml: 1 }}
									>
										{chunk.pdfName} p. {chunk.page_num + 1}
									</Typography>
									{/* <Button
										variant="text"
										disableRipple
										sx={{
											// background: "pink",
											// width: "fit-content",
											// overflow: "hidden",
											// textOverflow: "ellipsis",
											// whiteSpace: "nowrap",
											width: "100%",
											justifyContent: "flex-start",
											flexDirection: "column",
											textTransform: "none",
											color: theme.palette.text.primary,
											p: 0,
											"&:hover": {
												backgroundColor:
													theme.palette.primary.dark,
												color: "#454F59",
											},
											mb: 0.5,
										}}
										onClick={() => {
											handleOnClick(chunk);
										}}
									></Button> */}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Box>
		);
	}
};

export default Message;