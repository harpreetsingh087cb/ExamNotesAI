import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(`${serverUrl}/api/user/currentuser`, { withCredentials: true })
        if (result.data && !result.data.message) {
            dispatch(setUserData(result.data))
        } else {
            dispatch(setUserData(null))
        }
    } catch (error) {
        console.log("getCurrentUser error:", error?.response?.data || error.message)
        dispatch(setUserData(null))
    }
}

export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(`${serverUrl}/api/notes/generate-notes`, payload, { withCredentials: true })
        return result.data
    } catch (error) {
        console.log("generateNotes error:", error?.response?.data || error.message)
        throw error
    }
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(`${serverUrl}/api/pdf/generate-pdf`, { result }, {
            responseType: "blob",
            withCredentials: true
        })

        const blob = new Blob([response.data], {
            type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExamNotesAI.pdf";
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log("downloadPdf error:", error)
        throw new Error("PDF download failed");
    }
}