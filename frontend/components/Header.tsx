import React from "react";
import { Box, Divider, Icon, Link, Typography } from "@mui/material";
import { globalStyles } from "../styles";
import NextLink from "next/link";

const Header = () => {
	return (
		<Box>
			<Box sx={{ mx: globalStyles.mx, backgroundColor: "" }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						// background: "lightblue",
						height: globalStyles.headerHeight,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							width: "10%",
							// background: "pink",
						}}
					>
						<Link
							component={NextLink}
							href="/filter"
							underline="hover"
							color="black"
							variant="body1"
						>
							Filter
						</Link>
						<Link
							component={NextLink}
							href="/chat"
							underline="hover"
							color="black"
							variant="body1"
						>
							Chat
						</Link>
					</Box>
					<Box
						sx={{
							display: "flex",
							// background: "pink",
							marginLeft: "auto",
						}}
					>
						<Typography>Hello, Zhong Hern</Typography>
						<Icon />
					</Box>
				</Box>
			</Box>
			<Divider />
		</Box>
	);
};

export default Header;
