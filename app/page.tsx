"use client";
import { useState, SetStateAction, useEffect, Dispatch } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrickModeDroppable";
import {
  Plus,
  CheckSquare,
  Trophy,
  Settings2,
  Trash2,
  User2,
  CalendarCheck2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { v4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenubarContent } from "@radix-ui/react-menubar";

interface taskInterface {
  id: string;
  title: string;
  desc: string;
}

interface findStateInterface {
  todo: taskInterface[];
  inprogress: taskInterface[];
  completed: taskInterface[];
}

interface findSetFunInterface {
  todo: Dispatch<SetStateAction<taskInterface[]>>;
  inprogress: Dispatch<SetStateAction<taskInterface[]>>;
  completed: Dispatch<SetStateAction<taskInterface[]>>;
}

export default function Home() {
  const [todoList, setTodo] = useState<taskInterface[]>([]);
  const [ongoing, setOngoing] = useState<taskInterface[]>([]);
  const [complt, setComplt] = useState<taskInterface[]>([]);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [open, setOpen] = useState(false);

  const findState: findStateInterface = {
    todo: todoList,
    inprogress: ongoing,
    completed: complt,
  };
  const findSetFun: findSetFunInterface = {
    todo: setTodo,
    inprogress: setOngoing,
    completed: setComplt,
  };

  useEffect(() => {
  setTodo(JSON.parse(localStorage.getItem("todo") ?? "[]"));
  setOngoing(JSON.parse(localStorage.getItem("inprogress") ?? "[]"));
  setComplt(JSON.parse(localStorage.getItem("completed") ?? "[]"));
  },[])

  function handleDragEnd(result: DropResult) {
    console.log(result);
    console.log(todoList, ongoing, complt);
    if (!result.destination) return;
    if (
      result.destination.droppableId == result.source.droppableId &&
      result.destination.index == result.source.index
    )
      return;
    const sourceDup = Array.from(
      findState[`${result.source.droppableId}` as keyof findStateInterface]
    );
    const destinationDup = Array.from(
      findState[`${result.destination.droppableId}` as keyof findStateInterface]
    );
    // drag within a droppable
    if (result.destination.droppableId == result.source.droppableId) {
      const [reorderedItem] = sourceDup.splice(result.source.index, 1);
      sourceDup.splice(result.destination.index, 0, reorderedItem);
      findSetFun[`${result.source.droppableId}` as keyof findSetFunInterface](
        sourceDup
      );
      localStorage.setItem(result.destination.droppableId,JSON.stringify(sourceDup))
      return;
    }
    console.log("items", sourceDup);
    const [reorderedItem] = sourceDup.splice(result.source.index, 1);
    destinationDup.splice(result.destination.index, 0, reorderedItem);

    findSetFun[`${result.source.droppableId}` as keyof findSetFunInterface](
      sourceDup
    );
    findSetFun[
      `${result.destination.droppableId}` as keyof findSetFunInterface
    ](destinationDup);
    localStorage.setItem(result.source.droppableId,JSON.stringify(sourceDup))
    localStorage.setItem(result.destination.droppableId,JSON.stringify(destinationDup))
  }

  function handleAddTodo() {
    if (!title) return;
    const id = v4().toString();
    const newTodo = {
      id,
      title,
      desc,
    };
    //@ts-ignore
    setTodo([...todoList, newTodo]);
    localStorage.setItem("todo",JSON.stringify([...todoList,newTodo]))
    setOpen(false);
    setTitle("");
    setDesc("");
  }

  function deleteTask(type: keyof findSetFunInterface, index: number){
    const state = Array.from(findState[`${type}` as keyof findStateInterface])
    state.splice(index,1)
    findSetFun[`${type}` as keyof findSetFunInterface](state)
    localStorage.setItem(type,JSON.stringify(state));
  }
  return (
    <>
      <header className="flex justify-between items-center border-b-[1px] border-lightBlue  px-4">
        <section className="flex justify-center items-center py-3 gap-2">
          <CalendarCheck2 width="24px" height="24px" />
          <h1 className="text-xl font-medium ">Taskyy</h1>
        </section>
        <ul className="flex justify-center items-center gap-3">
          <li>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="p-2 rounded-full hover:bg-slate-100 drop-shadow bg-white">
                  <Plus width="24px" height="24px" color="black" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Todo</DialogTitle>
                  <DialogDescription>Create a new task.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 content-center ">
                  <div className="grid grid-cols-4  gap-4  content-center">
                    <Label htmlFor="name" className="text-left col-span-2">
                      Title
                    </Label>
                    <Input
                      id="name"
                      value={title}
                      placeholder="todo title"
                      required
                      className="col-span-4"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label htmlFor="username" className="text-left col-span-2">
                      Description
                    </Label>
                    <Textarea
                      placeholder="todo details...."
                      onChange={(e) => setDesc(e.target.value)}
                      value={desc}
                      required
                      className="col-span-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTodo} type="submit">
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <main className="grid grid-cols-3 flex-grow w-full gap-4 p-4">
          {/* todo section */}
          <StrictModeDroppable droppableId="todo">
            {(provided, snapshot) => {
              return (
                <section
                  className="p-5 flex flex-col gap-2 min-h-full bg-drop rounded-xl"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="flex gap-2 mb-2">
                    <Badge className="w-fit py-1" variant="default">
                      TodoList
                    </Badge>
                    <p className="text-blue-200">{todoList.length}</p>
                  </div>
                  {todoList &&
                    todoList.map((e, i) => {
                      return (
                        <Draggable key={e.id} draggableId={e.id} index={i}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="w-full p-3 bg-white drop-shadow rounded-md"
                              >
                                <div className="flex justify-between">
                                  <p className="text-lg font-medium">
                                    {e.title}
                                  </p>
                                  <Menubar>
                                    <MenubarMenu>
                                      <MenubarTrigger>
                                        <Button variant="ghost" className="p-2">
                                          <Settings2
                                            width="16px"
                                            height="16px"
                                          />
                                        </Button>
                                      </MenubarTrigger>
                                      <MenubarContent className="w-full bg-slate-100">
                                        <MenubarItem>
                                          <Button onClick={() => deleteTask("todo",i)} className="flex gap-2 hover:bg-white bg-white rounded justify-between items-center">
                                            <p className="text-black">Delete</p>
                                            <Trash2 width="16px" color="red" />
                                          </Button>
                                        </MenubarItem>
                                      </MenubarContent>
                                    </MenubarMenu>
                                  </Menubar>
                                </div>
                                <p className="text-base font-normal">
                                  {e?.desc}
                                </p>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </section>
              );
            }}
          </StrictModeDroppable>

          {/* inprogress section */}

          <StrictModeDroppable droppableId="inprogress">
            {(provided, snapshot) => {
              return (
                <section
                  className="p-5 bg-drop border-l-[1px] rounded-xl flex flex-col gap-2 border-r-[1px] border-lightBlue min-h-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="flex gap-2 mb-2">
                    <Badge className="w-fit py-1" variant="inprogress">
                      Inprogress
                    </Badge>
                    <p className="text-blue-200">{ongoing.length}</p>
                  </div>
                  {ongoing &&
                    ongoing.map((e, i) => {
                      return (
                        <Draggable key={e.id} draggableId={e.id} index={i}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="w-full p-3 bg-white drop-shadow rounded-md"
                              >
                                <div className="flex justify-between">
                                  <p className="text-lg font-medium">
                                    {e.title}
                                  </p>
                                  <Menubar>
                                    <MenubarMenu>
                                      <MenubarTrigger>
                                        <Button variant="ghost" className="p-2">
                                          <Settings2
                                            width="16px"
                                            height="16px"
                                          />
                                        </Button>
                                      </MenubarTrigger>
                                      <MenubarContent className="w-full bg-slate-100">
                                        <MenubarItem>
                                          <Button onClick={() => deleteTask("inprogress",i)} className="flex gap-2 hover:bg-white bg-white rounded justify-between items-center">
                                            <p className="text-black">Delete</p>
                                            <Trash2 width="16px" color="red" />
                                          </Button>
                                        </MenubarItem>
                                      </MenubarContent>
                                    </MenubarMenu>
                                  </Menubar>
                                </div>
                                <p className="text-base font-normal">
                                  {e?.desc}
                                </p>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </section>
              );
            }}
          </StrictModeDroppable>

          {/* completed section */}
          <StrictModeDroppable droppableId="completed">
            {(provided, snapshot) => {
              return (
                <section
                  className="p-5 bg-drop border-l-[1px] rounded-xl flex flex-col gap-2 border-r-[1px] border-lightBlue min-h-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="flex gap-2 mb-2">
                    <Badge className="w-fit py-1" variant="secondary">
                      Completed
                    </Badge>
                    <p className="text-blue-200">{complt.length}</p>
                  </div>
                  {complt &&
                    complt.map((e, i) => {
                      return (
                        <Draggable key={e.id} draggableId={e.id} index={i}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="w-full p-3 bg-white drop-shadow rounded-md"
                              >
                                <div className="flex justify-between">
                                  <p className="text-lg font-medium">
                                    {e.title}
                                  </p>
                                  <Menubar>
                                    <MenubarMenu>
                                      <MenubarTrigger>
                                        <Button variant="ghost" className="p-2">
                                          <Settings2
                                            width="16px"
                                            height="16px"
                                          />
                                        </Button>
                                      </MenubarTrigger>
                                      <MenubarContent className="w-full bg-slate-100">
                                        <MenubarItem>
                                          <Button onClick={() => deleteTask("completed",i)} className="flex gap-2 hover:bg-white bg-white rounded justify-between items-center">
                                            <p className="text-black">Delete</p>
                                            <Trash2 width="16px" color="red" />
                                          </Button>
                                        </MenubarItem>
                                      </MenubarContent>
                                    </MenubarMenu>
                                  </Menubar>
                                </div>
                                <p className="text-base font-normal">
                                  {e?.desc}
                                </p>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </section>
              );
            }}
          </StrictModeDroppable>
        </main>
      </DragDropContext>
    </>
  );
}
