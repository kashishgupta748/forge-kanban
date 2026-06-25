<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Card;
use App\Models\Comment;
use App\Models\KanbanList;
use App\Models\Member;
use App\Models\Tag;
use App\Models\Activity;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    public function run(): void
    {
        $members = Member::all();

        // ─── Board 1: Product Roadmap ──────────────────────────────
        $board1 = Board::create([
            'name'        => 'Product Roadmap',
            'description' => 'High-level product strategy and feature planning for Q1-Q2 2026',
            'color'       => '#6366f1',
        ]);

        $tag_feature = Tag::create(['board_id' => $board1->id, 'name' => 'Feature',     'color' => '#10b981']);
        $tag_bug     = Tag::create(['board_id' => $board1->id, 'name' => 'Bug',         'color' => '#ef4444']);
        $tag_design  = Tag::create(['board_id' => $board1->id, 'name' => 'Design',      'color' => '#f59e0b']);
        $tag_infra   = Tag::create(['board_id' => $board1->id, 'name' => 'Infra',       'color' => '#3b82f6']);
        $tag_urgent  = Tag::create(['board_id' => $board1->id, 'name' => 'Urgent',      'color' => '#dc2626']);

        $list_backlog  = KanbanList::create(['board_id' => $board1->id, 'name' => 'Backlog',      'position' => 0]);
        $list_planned  = KanbanList::create(['board_id' => $board1->id, 'name' => 'Planned',      'position' => 1]);
        $list_inprog   = KanbanList::create(['board_id' => $board1->id, 'name' => 'In Progress',  'position' => 2]);
        $list_done     = KanbanList::create(['board_id' => $board1->id, 'name' => 'Done',         'position' => 3]);

        $cards1 = [
            [
                'list'        => $list_inprog,
                'title'       => 'Implement drag-and-drop Kanban board',
                'description' => 'Integrate @dnd-kit to support card dragging between lists and reordering within lists.',
                'due_date'    => Carbon::now()->addDays(2),
                'tags'        => [$tag_feature, $tag_urgent],
                'members'     => $members->take(2),
                'comments'    => [
                    ['body' => 'Using @dnd-kit/sortable for this. Should be straightforward.', 'member' => $members->first()],
                    ['body' => 'Make sure to handle touch events for mobile.', 'member' => $members->get(1)],
                ],
            ],
            [
                'list'        => $list_inprog,
                'title'       => 'Build card detail modal with activity log',
                'description' => 'Full card view with description editing, member assignment, tag management, comments, and activity history.',
                'due_date'    => Carbon::now()->subDay(), // OVERDUE
                'tags'        => [$tag_feature, $tag_design],
                'members'     => $members->take(1),
                'comments'    => [
                    ['body' => 'Design mockup approved. Starting implementation.', 'member' => $members->first()],
                ],
            ],
            [
                'list'        => $list_planned,
                'title'       => 'Dashboard analytics & stats',
                'description' => 'Show total boards, cards, overdue count, due-today count, and recent activity feed on the dashboard.',
                'due_date'    => Carbon::now()->addDays(5),
                'tags'        => [$tag_feature],
                'members'     => $members->take(3),
                'comments'    => [],
            ],
            [
                'list'        => $list_backlog,
                'title'       => 'Multi-board Slack notifications',
                'description' => 'Send Slack notifications when cards are moved, overdue, or assigned to a member.',
                'due_date'    => Carbon::now()->addDays(14),
                'tags'        => [$tag_feature, $tag_infra],
                'members'     => [],
                'comments'    => [],
            ],
            [
                'list'        => $list_done,
                'title'       => 'Set up Laravel 12 API with SQLite',
                'description' => 'Initial project scaffold: migrations, models, controllers, seeders.',
                'due_date'    => Carbon::now()->subDays(3),
                'tags'        => [$tag_infra],
                'members'     => $members->take(2),
                'comments'    => [
                    ['body' => 'All migrations running cleanly. SQLite chosen for portability.', 'member' => $members->first()],
                ],
            ],
            [
                'list'        => $list_done,
                'title'       => 'React + Vite + TailwindCSS project setup',
                'description' => 'Frontend scaffold with TypeScript, React Query, Axios, and routing.',
                'due_date'    => Carbon::now()->subDays(2),
                'tags'        => [$tag_infra, $tag_design],
                'members'     => $members->take(2),
                'comments'    => [],
            ],
        ];

        foreach ($cards1 as $i => $data) {
            $card = Card::create([
                'list_id'     => $data['list']->id,
                'title'       => $data['title'],
                'description' => $data['description'],
                'due_date'    => $data['due_date'],
                'position'    => $i,
            ]);

            if (!empty($data['tags'])) {
                $card->tags()->attach(collect($data['tags'])->pluck('id'));
            }
            if (!empty($data['members'])) {
                $card->members()->attach(collect($data['members'])->pluck('id'));
            }
            foreach ($data['comments'] as $comment) {
                Comment::create([
                    'card_id'   => $card->id,
                    'member_id' => $comment['member']?->id,
                    'body'      => $comment['body'],
                ]);
            }

            Activity::create([
                'board_id'    => $board1->id,
                'card_id'     => $card->id,
                'type'        => 'card_created',
                'description' => "Card \"{$card->title}\" was created.",
            ]);
        }

        // ─── Board 2: Engineering Sprint ──────────────────────────
        $board2 = Board::create([
            'name'        => 'Engineering Sprint',
            'description' => 'Two-week engineering sprint tracking technical tasks and bug fixes',
            'color'       => '#0ea5e9',
        ]);

        $tag_b2_bug   = Tag::create(['board_id' => $board2->id, 'name' => 'Bug',         'color' => '#ef4444']);
        $tag_b2_tech  = Tag::create(['board_id' => $board2->id, 'name' => 'Tech Debt',   'color' => '#8b5cf6']);
        $tag_b2_perf  = Tag::create(['board_id' => $board2->id, 'name' => 'Performance', 'color' => '#f97316']);
        $tag_b2_test  = Tag::create(['board_id' => $board2->id, 'name' => 'Testing',     'color' => '#14b8a6']);

        $b2_todo  = KanbanList::create(['board_id' => $board2->id, 'name' => 'To Do',        'position' => 0]);
        $b2_doing = KanbanList::create(['board_id' => $board2->id, 'name' => 'Doing',        'position' => 1]);
        $b2_review= KanbanList::create(['board_id' => $board2->id, 'name' => 'In Review',    'position' => 2]);
        $b2_done  = KanbanList::create(['board_id' => $board2->id, 'name' => 'Done',         'position' => 3]);

        $cards2 = [
            ['list' => $b2_doing, 'title' => 'Fix N+1 query in card listing API',          'due' => Carbon::now()->subDays(1), 'tags' => [$tag_b2_bug, $tag_b2_perf]],
            ['list' => $b2_doing, 'title' => 'Add pagination to activity feed',             'due' => Carbon::now()->addDays(1), 'tags' => [$tag_b2_tech]],
            ['list' => $b2_todo,  'title' => 'Write feature tests for card move endpoint',  'due' => Carbon::now()->addDays(3), 'tags' => [$tag_b2_test]],
            ['list' => $b2_todo,  'title' => 'Implement Redis caching for dashboard stats', 'due' => Carbon::now()->addDays(7), 'tags' => [$tag_b2_perf, $tag_b2_tech]],
            ['list' => $b2_review,'title' => 'Refactor list reorder to use transactions',   'due' => Carbon::now()->addDays(1), 'tags' => [$tag_b2_tech]],
            ['list' => $b2_done,  'title' => 'Add CORS configuration for frontend',         'due' => Carbon::now()->subDays(4), 'tags' => [$tag_b2_bug]],
            ['list' => $b2_done,  'title' => 'Set up GitHub Actions CI pipeline',           'due' => Carbon::now()->subDays(2), 'tags' => [$tag_b2_tech]],
        ];

        foreach ($cards2 as $i => $data) {
            $card = Card::create([
                'list_id'  => $data['list']->id,
                'title'    => $data['title'],
                'due_date' => $data['due'],
                'position' => $i,
            ]);
            $card->tags()->attach(collect($data['tags'])->pluck('id'));
            if ($members->count() > 0) {
                $card->members()->attach([$members->random()->id]);
            }
            Activity::create([
                'board_id'    => $board2->id,
                'card_id'     => $card->id,
                'type'        => 'card_created',
                'description' => "Card \"{$card->title}\" was created.",
            ]);
        }

        // ─── Board 3: Marketing Campaigns ─────────────────────────
        $board3 = Board::create([
            'name'        => 'Marketing Campaigns',
            'description' => 'Campaign planning, content calendar, and launch coordination',
            'color'       => '#f59e0b',
        ]);

        $tag_m_content = Tag::create(['board_id' => $board3->id, 'name' => 'Content',   'color' => '#6366f1']);
        $tag_m_social  = Tag::create(['board_id' => $board3->id, 'name' => 'Social',    'color' => '#ec4899']);
        $tag_m_email   = Tag::create(['board_id' => $board3->id, 'name' => 'Email',     'color' => '#0ea5e9']);
        $tag_m_launch  = Tag::create(['board_id' => $board3->id, 'name' => 'Launch',    'color' => '#10b981']);

        $m_ideas  = KanbanList::create(['board_id' => $board3->id, 'name' => 'Ideas',       'position' => 0]);
        $m_draft  = KanbanList::create(['board_id' => $board3->id, 'name' => 'Drafting',    'position' => 1]);
        $m_review = KanbanList::create(['board_id' => $board3->id, 'name' => 'Review',      'position' => 2]);
        $m_pub    = KanbanList::create(['board_id' => $board3->id, 'name' => 'Published',   'position' => 3]);

        $cards3 = [
            ['list' => $m_draft,  'title' => 'Launch blog post: Introducing Forge Kanban',    'due' => Carbon::now()->addDays(2),  'tags' => [$tag_m_content, $tag_m_launch]],
            ['list' => $m_draft,  'title' => 'Write tweet thread on agent-assisted dev',       'due' => Carbon::now()->subDays(1),  'tags' => [$tag_m_social]],
            ['list' => $m_review, 'title' => 'Email newsletter: June sprint recap',            'due' => Carbon::now()->addDays(1),  'tags' => [$tag_m_email]],
            ['list' => $m_ideas,  'title' => 'LinkedIn post: Building with Hermes + OpenClaw', 'due' => Carbon::now()->addDays(10), 'tags' => [$tag_m_social, $tag_m_content]],
            ['list' => $m_pub,    'title' => 'GitHub README polish and screenshots',           'due' => Carbon::now()->subDays(5),  'tags' => [$tag_m_launch]],
        ];

        foreach ($cards3 as $i => $data) {
            $card = Card::create([
                'list_id'  => $data['list']->id,
                'title'    => $data['title'],
                'due_date' => $data['due'],
                'position' => $i,
            ]);
            $card->tags()->attach(collect($data['tags'])->pluck('id'));
            if ($members->count() > 0) {
                $card->members()->attach([$members->random()->id]);
            }
            Activity::create([
                'board_id'    => $board3->id,
                'card_id'     => $card->id,
                'type'        => 'card_created',
                'description' => "Card \"{$card->title}\" was created.",
            ]);
        }
    }
}
