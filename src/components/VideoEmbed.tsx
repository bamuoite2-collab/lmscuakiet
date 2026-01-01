import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, ExternalLink } from 'lucide-react';

interface VideoEmbedProps {
    url: string;
    title?: string;
    description?: string;
}

export function VideoEmbed({ url, title, description }: VideoEmbedProps) {
    // Extract video ID from YouTube URLs
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Video className="h-5 w-5 text-red-500" />
                    {title || 'Video Giải Thích'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {description && (
                    <p className="text-sm text-muted-foreground mb-4">{description}</p>
                )}

                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                        src={embedUrl}
                        title={title || 'Video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {videoId && (
                    <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                    >
                        Xem trên YouTube
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </CardContent>
        </Card>
    );
}
