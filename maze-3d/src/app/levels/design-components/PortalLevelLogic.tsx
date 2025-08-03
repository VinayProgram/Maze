import { useMazeCellStore } from '@/store/mazeStore';
import { DialogContext } from '@/components/portalcustom/custom-portal-context';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // Shadcn Button component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Shadcn Card components
import { DoorClosed, Sparkles } from 'lucide-react'; // Lucide React icons

const PortalLevelLogic = ({ id, cb }: { id: string; cb: (id: string) => void }) => {
  const dialogContext = React.useContext(DialogContext);
  const maze = useMazeCellStore((state) => state.level);

  // Find all portal doors in the maze
  const findAllDoors = maze?.map((row) => row.filter((cell) => cell.isPortal)).flat() || [];

  // Filter out the current door and ensure there's at least one other door
  const availableDoors = findAllDoors.filter((door) => door.id !== id);

  if (availableDoors.length === 0) {
    toast.error('No other portal doors found to jump to!');
    dialogContext.setComponent(null);
    return null;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Card
        className="
          w-full max-w-md bg-gradient-to-br from-blue-700 via-fuchsia-700 to-blue-900
          text-white shadow-2xl border-none rounded-lg
        "
      >
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-extrabold flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-fuchsia-300 animate-pulse" />
            Choose Your Destination Portal
            <Sparkles className="h-8 w-8 text-fuchsia-300 animate-pulse" />
          </CardTitle>
          <CardDescription className="text-fuchsia-200 text-lg mt-2">
            Select a mystical door to teleport to a new location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableDoors.map((door) => (
            <Button
              key={door.id}
              className="
                w-full flex items-center justify-center gap-3 py-6 text-lg
                bg-fuchsia-600 hover:bg-fuchsia-700
                text-white font-semibold rounded-lg shadow-md
                transition-all duration-300 ease-in-out transform hover:scale-105
                border border-fuchsia-400
              "
              onClick={() => {
                cb(door.id);
                dialogContext.setComponent(null); // Close the dialog after selection
                toast.success(`Teleported to door: ${door.id}`);
              }}
            >
              <DoorClosed className="h-6 w-6" />
              Portal {door.id}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalLevelLogic;