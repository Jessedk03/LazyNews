import {Source} from "./SourceType";

export type Article = {
    id: string;
    title: string;
    description: string;
    content: string;
    url: string;
    image_url: string;
    source: Source;
}