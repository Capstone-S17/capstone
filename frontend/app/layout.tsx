import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import styles from "./layout.module.css";

import ThemeWrapper from "@components/ThemeWrapper";

export const metadata = {
	title: "Handshakes",
	description: "Generated by Next.js",
};

export default function Layout(props: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className={styles.root}>
				<ThemeWrapper>
					<AppRouterCacheProvider>
						{props.children}
					</AppRouterCacheProvider>
				</ThemeWrapper>
			</body>
		</html>
	);
}
