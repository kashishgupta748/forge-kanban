<?php

namespace Tests\Feature;

use App\Models\Board;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_endpoint_returns_success()
    {
        $response = $this->getJson('/api/v1/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'total_boards',
                    'total_cards',
                    'overdue_cards',
                    'cards_due_today',
                    'recent_activities',
                    'boards_summary',
                ]
            ]);
    }
}
