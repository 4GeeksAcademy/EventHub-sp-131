import { useState, useEffect, useRef, useCallback } from "react"
import { useDebounce } from "./useDebounce"

const tmbKey = import.meta.env.VITE_TM_API_KEY

export function useArtistSearch() {
    const [artistQuery, setArtistQuery] = useState("")
    const [artistSuggestions, setArtistSuggestions] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [skipNextSearch, setSkipNextSearch] = useState(false)
    const containerRef = useRef(null)
    const debouncedInput = useDebounce(artistQuery, 600)

    useEffect(() => {
        if (artistQuery.length === 0) {
            setSelectedArtist(null)
        }
    }, [artistQuery])

    useEffect(() => {
        if (debouncedInput.length < 3) {
            setArtistSuggestions([])
            setIsDropdownOpen(false)
            return
        }

        if (skipNextSearch) {
            setSkipNextSearch(false)
            return
        }

        const fetchArtists = async () => {
            try {
                const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${debouncedInput}&apikey=${tmbKey}`
                const res = await fetch(url)
                const data = await res.json()
                const events = data._embedded?.events ?? []
                setArtistSuggestions(events)
                setIsDropdownOpen(events.length > 0)
            } catch (err) {
                console.error("Error fetching artists:", err)
            }
        }

        fetchArtists()
    }, [debouncedInput])

    const handleMouseDown = useCallback((e) => {
        if (isDropdownOpen && !containerRef.current?.contains(e.target)) {
            setIsDropdownOpen(false)
        }
    }, [isDropdownOpen])

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown)
        return () => document.removeEventListener("mousedown", handleMouseDown)
    }, [handleMouseDown])

    const selectArtist = (item) => {
        setSelectedArtist(item)
        setArtistQuery(item.name)
        setIsDropdownOpen(false)
        setArtistSuggestions([])
        setSkipNextSearch(true)
    }

    return {
        artistQuery,
        setArtistQuery,
        artistSuggestions,
        isDropdownOpen,
        selectedArtist,
        containerRef,
        selectArtist,
    }
}