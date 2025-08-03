import React, { useState, useEffect } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Heart, User, Calendar, Search, Frown, Play, EyeIcon, WineIcon, TrophyIcon } from "lucide-react";

import { useMazeLevels } from "../services/get-levels";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@tanstack/react-router";
import type { SaveLevelDTO } from "../services/dto/save-level";
import { Button } from "@/components/ui/button";
import { useMazeCellStore } from "@/store/mazeStore";
import { DialogContext } from "@/components/portalcustom/custom-portal-context";
import LevelStats from "./LevelStats";

// A debouncing custom hook to prevent API calls on every keystroke
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const PAGE_SIZE = 9; // Must match the PAGE_SIZE in your service

export const MazeLevelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigation = useRouter()
  const [page, setPage] = useState(0); // 0-indexed current page
  const [lastDocHistory, setLastDocHistory] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);
  const setLevel = useMazeCellStore((state) => state.setLevel)
  const dailogContext = React.useContext(DialogContext)
  const currentLastDoc = lastDocHistory[page];

  const { data, isLoading, isError, isFetching } = useMazeLevels(
    currentLastDoc,
    debouncedSearchTerm
  );

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  // Reset pagination when a new search is performed
  useEffect(() => {
    setPage(0);
    setLastDocHistory([null]);
  }, [debouncedSearchTerm]);


  // Store the last document of the current page to enable fetching the next page
  useEffect(() => {
    if (data?.lastDoc && page === lastDocHistory.length - 1) {
      setLastDocHistory(prev => [...prev, data.lastDoc]);
    }
  }, [data, page, lastDocHistory.length]);

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    // We only allow going to the next page if we have a cursor for it
    // or if we are not on the last possible page.
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-muted-foreground">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-card border rounded-lg py-20">
      <Frown className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold">No Levels Found</h2>
      <p>Try adjusting your search or create a new level!</p>
    </div>
  )

  const onPlay = (level: SaveLevelDTO) => {
    setLevel(JSON.parse(level.maze))
    navigation.navigate({ to: '/game/$id',params:{id:level.id} })
  }

  const onEdit = (level: SaveLevelDTO) => {
    setLevel(JSON.parse(level.maze))
    navigation.navigate({ to: '/design-level' })
  }

  const onStats = (level: SaveLevelDTO) => {
    dailogContext.setComponent(<LevelStats levelId={level.id} />)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Levels</h1>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search levels by title..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <p className="text-center text-destructive">Failed to load levels.</p>
      ) : !data || data.mazeLevels.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.mazeLevels.map((level) => (
              <Card key={level.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="truncate">{level.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    <User className="h-4 w-4" />
                    <span>{level.creatorName || "Anonymous"}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    A challenging maze adventure awaits. Click to play!
                  </p>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500/80" />
                    <span>{level.likes.toLocaleString()} Likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(level.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                  <Button variant="secondary" onClick={() => onStats(level)}>
                    <TrophyIcon fill="gold" className="mr-2 h-4 w-4" /> Stats
                  </Button>
                  <Button variant="secondary" onClick={() => onPlay(level)}>
                    <Play className="mr-2 h-4 w-4" /> Play
                  </Button>
                  <Button variant="secondary" onClick={() => onEdit(level)}>
                    <EyeIcon className="mr-2 h-4 w-4" /> View Level
                  </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                  className={page === 0 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="font-medium px-4 py-2">
                  Page {page + 1} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                  className={page + 1 >= totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground text-sm font-semibold py-2 px-4 rounded-full shadow-lg animate-pulse">
          Fetching...
        </div>
      )}
    </div>
  );
};

export default MazeLevelsPage