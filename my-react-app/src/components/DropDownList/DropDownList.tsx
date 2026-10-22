"use client";

import {EllipsisVertical, Pencil, TrashBin} from "@gravity-ui/icons";
import {Button, Dropdown, Header, Label, toast} from "@heroui/react";
import { deletePost } from "../../Services/deletePost.servieces";
import { bookmarkPost } from "../../Services/bookmark.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { userDataContext } from "../../context/userDataContext";
import { Bookmark, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function DropDownList({postId, isBookmarked, postUserId, showDetails }: {postId:string, isBookmarked?: boolean, postUserId?: string, showDetails?: boolean }) {

  const navigate = useNavigate();
  const {userToken} = useContext(AuthContext)
  const {userData} = useContext(userDataContext)
  const currentUserId = userData?.data?.user?._id;
  const isOwner = currentUserId && postUserId && currentUserId === postUserId;

  async function deletePostFun(){
   const response = await deletePost(userToken , postId);
   return response;
  }

  async function bookmarkPostFun(){
    if(!userToken) return;
    const response = await bookmarkPost(userToken, postId);
    return response;
  }


  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: deletePostFun,
    onSuccess: (response: any) => {
      toast.success(response?.message || "done deleted post");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    }
  });

  const {mutate: mutateBookmark} = useMutation({
    mutationFn: bookmarkPostFun,
    onSuccess: (response: any) => {
      toast.success(response?.message || (isBookmarked ? "Post unsaved" : "Post saved"));
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["connectionPosts"] });
    },
    onError: (error: string) => {
      toast.error("Failed to bookmark post");
    }
  });



  return (
    <Dropdown>
      <Button isIconOnly aria-label="Menu" variant="secondary">
        <EllipsisVertical className="outline-none" />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => {
          if (key === "bookmark-post") {
            mutateBookmark();
          } else if (key === "show-details") {
            navigate(`/PostDetails/${postId}`);
          } else if (key === "delete-file") {
            mutate();
          }
        }}>
          <Dropdown.Section>
            <Header>Actions</Header>
          
            {isOwner && (
            <Dropdown.Item id="edit-file" textValue="Edit file">
              <div className="flex h-8 items-center justify-center pt-px">
                <Pencil className="size-4 shrink-0 text-muted" />
              </div>
              <div className="flex flex-col">
                <Label>Edit file</Label>
              </div>
            </Dropdown.Item>
            )}
            <Dropdown.Item id="bookmark-post" textValue="Bookmark post">
              <div className="flex h-8 items-center justify-center pt-px">
                <Bookmark className={`w-4 h-4 shrink-0 ${isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
              </div>
              <div className="flex flex-col">
                <Label>{isBookmarked ? 'Unsave post' : 'Save post'}</Label>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>

          {isOwner && (
          <Dropdown.Section>
            <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
              <div className="flex h-8 items-center justify-center pt-px">
                <TrashBin className="size-4 shrink-0 text-danger" />
              </div>
              <div className="flex flex-col">
                <Label>Delete file</Label>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}