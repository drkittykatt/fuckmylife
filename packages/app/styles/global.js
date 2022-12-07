import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
    textAlign: "center",
  },
  defaultText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#333",
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
    textAlign: "center",
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    minWidth: 160,
    alignItems: "stretch",
    //width: "100%",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "#34b7f1",
  },
  primaryLoginButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "#34b7f1",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  backButton: {
    paddingTop: 60,
    alignSelf: "flex-beginning",
    marginLeft: 15,
  },
  outlineButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#34b7f1",
    borderRadius: 6,
  },
});
