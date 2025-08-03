import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import useMutationLikeSaveStats, { useSaveLikeCount } from "../services/save-level-stats";

// Define the shape of our form data and errors
interface FormData {
  name: string;
  likedLevel: "yes" | "no" | "";
  submitStats: boolean;
}

interface FormErrors {
  name?: string;
  likedLevel?: string;
  submitStats?: string;
}

export const SavePlayerRatings = ({time,levelId}: {time:number,levelId: string}) => {
  // 1. State for form fields
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    likedLevel: "",
    submitStats: false,
  });
  const {mutateAsync:mutateLikeStats} =useMutationLikeSaveStats()
  const {mutateAsync:mutateLikeCount}=useSaveLikeCount()
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submissionMessage, setSubmissionMessage] = React.useState("");
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }
    if (!formData.likedLevel) {
      newErrors.likedLevel = "Please select an option.";
    }
    if (!formData.submitStats) {
      newErrors.submitStats = "You must agree to submit your stats.";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // If there are no errors, proceed with submission
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted:", formData);
      setSubmissionMessage("Thank you! Your feedback has been saved.");
      setFormData({ name: "", likedLevel: "", submitStats: false });
      await mutateLikeStats({
        playerName: formData.name,
        likedLevel: formData.likedLevel === "yes",
        levelId: levelId,
        createdAt: new Date().toString(),
        completionTime: time
      })
      await mutateLikeCount({levelId:levelId,liked:formData.likedLevel === "yes"})
      // Hide the message after 3 seconds
      setTimeout(() => setSubmissionMessage(""), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Rate this Level</CardTitle>
          <CardDescription>
            Let us know what you thought. Your feedback helps us improve.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name..."
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Liked Level Field */}
            <div className="space-y-3">
              <Label>Did you like this level? 🤔</Label>
              <RadioGroup
                value={formData.likedLevel}
                onValueChange={(value: "yes" | "no") =>
                  setFormData({ ...formData, likedLevel: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="r1" />
                  <Label htmlFor="r1" className="font-normal">
                    Yes, it was great!
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="r2" />
                  <Label htmlFor="r2" className="font-normal">
                    No, not really
                  </Label>
                </div>
              </RadioGroup>
              {errors.likedLevel && (
                <p className="text-sm font-medium text-destructive">{errors.likedLevel}</p>
              )}
            </div>

            {/* Submit Stats Field */}
            <div className="flex items-start space-x-3 rounded-md border p-4 shadow-sm">
               <Checkbox
                id="submitStats"
                checked={formData.submitStats}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, submitStats: !!checked })
                }
              />
              <div className="grid gap-1.5 leading-none">
                 <Label htmlFor="submitStats" className="cursor-pointer">
                    Submit my game stats
                 </Label>
                 <p className="text-sm text-muted-foreground">
                    By checking this, you agree to submit anonymous stats like completion time.
                 </p>
                 {errors.submitStats && (
                    <p className="text-sm font-medium text-destructive pt-2">{errors.submitStats}</p>
                 )}
              </div>
            </div>

             {/* Submission Success Message */}
            {submissionMessage && (
                <div className="p-3 text-center text-sm font-medium text-green-700 bg-green-100 rounded-md">
                    {submissionMessage}
                </div>
            )}
            
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </CardContent>
        </form>
        <CardFooter>
           <p className="text-xs text-muted-foreground text-center w-full">
            We value your privacy and will not share your name.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SavePlayerRatings;